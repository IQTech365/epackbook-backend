const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const moment = require("moment");
const html_to_pdf = require("html-pdf-node");
const QUOTATION = require("../Models/Quotations");
const TEMPLATES = require("../Models/Templates");
const ENQUIRIES = require("../Models/Enquiries");
const { doesContainRestrictedFields } = require("../Utils/helpers");

/**
 * @param req.body
 * @returns
 */
const createQuotation = async (req, res) => {
  const RESTRICTED_FIELDS = ["isActive", "createdAt", "updatedAt"];
  try {
    // if upcoming values contains any restricted field then don't update
    const enquiryId = req.enquiryId;
    const isContainRestrictedField = doesContainRestrictedFields(
      RESTRICTED_FIELDS,
      Object.keys(req.body)
    );
    if (isContainRestrictedField) {
      return res.sendStatus(403);
    }

    await QUOTATION.create({ ...req.body, enquiry: enquiryId });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

/**
 * @queryParam { skip, limit, enquiryId } req
 * @param { body } res
 * @returns quotations by enquiryId
 */
const getQuotationsByEnquiryId = async (req, res) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const enquiryId = req.enquiryId;

    const instances = await QUOTATION.find({
      enquiry: mongoose.Types.ObjectId(enquiryId),
    })
      .populate("enquiry")
      .populate("template", "name")
      .skip(skip)
      .limit(limit);

    return res.send({
      code: 200,
      data: instances,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

/**
 * @queryParam {  enquiryId, quotationId } req
 * @param { body } res
 * @returns quotation by enquiryId
 */
const getQuotationByEnquiryId = async (req, res) => {
  try {
    const enquiryId = req.enquiryId;
    const { quotationId } = req.params;
    const instances = await QUOTATION.findOne({
      $and: [
        {
          _id: quotationId,
        },
        {
          enquiry: mongoose.Types.ObjectId(enquiryId),
        },
      ],
    })
      .populate("template", "name")
      .populate("enquiry")
      .select("-__v");
    // .lean();

    return res.send({
      code: 200,
      data: instances,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

/**
 * Get Quotation PDF
 * @param {  enquiryId, quotationId } req
 * @returns PDF
 */
const getQuotationPDF = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const enquiryId = req.enquiryId;

    const enquiry = await ENQUIRIES.findById(enquiryId)
      .populate("client")
      .lean();

    if (!enquiry) {
      return res.send({
        code: 404,
        error: "Client Not Found",
      });
    }

    const client = enquiry.client;
    const quotation = await QUOTATION.findById(quotationId);

    if (!quotation) {
      return res.send({
        code: 404,
        error: "Quotation Not Found",
      });
    }

    const template = await TEMPLATES.findOne({
      _id: mongoose.Types.ObjectId(quotation.template),
    });

    if (!template) {
      return res.send({
        code: 404,
        error: "Quotation Not Found",
      });
    }

    // const ejsfile = path.resolve(
    //   __dirname,
    //   "../",
    //   "Templates",
    //   "quotation.ejs"
    // );
    // const fs = require("fs");
    // const abc = fs.readFileSync(ejsfile, { encoding: "utf-8" });
    // const compiled = ejs.compile(abc, {
    //   compileDebug: true,
    // });
    const compiled = ejs.compile(template.templateHTML, {
      compileDebug: true,
    });

    const data = {
      company_name: client.company.name,
      company_phone: `${client.phone.primary.cc}${client.phone.primary.number}`,
      company_mobile:
        client.phone.alternates.length > 0
          ? `${client.phone.alternates[0].cc}${client.phone.alternates[0].number}`
          : "",
      company_logo: client.company.logo,
      company_email: client.email,
      company_gstin: client.documents.gst,
      quotation_number: quotation.quotation.number,
      quotation_date: moment(quotation.createdAt).format("DD MMM YYYY"),
      client_company_name: enquiry.companyName,
      contact_person: enquiry.contactPerson,
      contact_number: enquiry.mobile,
      client_address: `${enquiry.pickupAddress.street}, ${enquiry.pickupAddress.landmark} ${enquiry.pickupAddress.state}-${enquiry.pickupAddress.postalCode}`,
      client_email: enquiry.email,
      shifting_date: new Date(enquiry.shiftingDate).toLocaleDateString(),
      shifting_type: enquiry.shiftingType,
      shifting_luggage: enquiry.shiftingLuggage
        ? enquiry.shiftingLuggage.join(",")
        : "",
      shifting_from: `${enquiry.pickupAddress?.shiftingFrom} - ${enquiry.pickupAddress.street}, ${enquiry.pickupAddress.landmark} ${enquiry.pickupAddress.state}-${enquiry.pickupAddress.postalCode}`,
      shifting_to: `${enquiry.dropAddress?.shiftingTo} - ${enquiry.dropAddress.street}, ${enquiry.dropAddress.landmark} ${enquiry.dropAddress.state}-${enquiry.dropAddress.postalCode}`,
      company_terms: client.company?.tnc,
      net_total: quotation.netTotal,
      freightDetails: quotation.freightDetails,
      transitInsurance: quotation.transitInsurance.charges,
      storageCharges: {
        ...quotation.storageCharges,
        fromDate: moment(quotation.storageCharges.fromDate).format(
          "DD MMM YYYY"
        ),
        toDate: moment(quotation.storageCharges.toDate).format("DD MMM YYYY"),
      },
      otherCharges: quotation.otherCharges,
      surcharge: quotation.surcharge,
      gst: quotation.gst,
      totalGST: quotation.totalGST,
      totalSurcharge: quotation.totalSurcharge,
      totalAmountExcludingGST: quotation.totalAmountExcludingGST,
      net_total: quotation.netTotal,
    };
    console.log(enquiry.pickupAddress);
    const html = compiled({
      data,
    });

    const PDF_PATH = path.resolve(
      __dirname,
      "../",
      "Templates",
      "quotation.pdf"
    );
    let options = {
      format: "A4",
      path: PDF_PATH,
      printBackground: true,
    };
    let file = { content: html };
    html_to_pdf.generatePdf(file, options, (err, pdfBuffer) => {
      if (err) {
        console.log(err);
        throw new Error(err);
      }
      res.sendFile(PDF_PATH);
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      error: "Error occured!",
    });
  }
};

/** update quotation */
const updateQuotation = async (req, res) => {
  try {
    const enquiryId = req.enquiryId;
    const { quotationId } = req.params;
    const instance = await QUOTATION.updateOne(
      {
        _id: quotationId,
      },
      req.body
    );
    if (instance.modifiedCount) {
      res.send({
        code: 200,
        message: "QUOTATION Updated Successfully",
      });
    } else {
      res.status(404).json({
        code: 404,
        error: "Not Found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

module.exports = {
  createQuotation,
  getQuotationsByEnquiryId,
  getQuotationByEnquiryId,
  getQuotationPDF,
  updateQuotation,
};
