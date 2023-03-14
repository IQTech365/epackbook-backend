const mongoose = require("mongoose");
const MONEY_RECEIPT = require("../Models/MoneyReceipt");
const ORDER = require("../Models/Orders");
const TEMPLATES = require("../Models/Templates");
const path = require("path");
const ejs = require("ejs");
const html_to_pdf = require("html-pdf-node");
const { doesContainRestrictedFields } = require("../Utils/helpers");

/**
 * @param req.body
 * @returns
 */
const createMoneyReceipt = async (req, res) => {
  const RESTRICTED_FIELDS = ["isActive", "createdAt", "updatedAt"];
  try {
    // if upcoming values contains any restricted field then don't update
    const isContainRestrictedField = doesContainRestrictedFields(
      RESTRICTED_FIELDS,
      Object.keys(req.body)
    );
    if (isContainRestrictedField) {
      return res.sendStatus(403);
    }

    await MONEY_RECEIPT.create(Object.assign(req.body, { order: req.orderId }));
    res.sendStatus(200);
  } catch (error) {
    return res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

/**
 * @queryParam { skip, limit } req
 * @param { body } res
 * @returns orders
 */
const getMoneyReceiptsByOrderId = async (req, res) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 1;
    const orderId = req.orderId;
    const instances = await MONEY_RECEIPT.find({
      order: mongoose.Types.ObjectId(orderId),
    })
      .select("-__v")
      .skip(skip)
      .limit(limit)
      .lean();
    res.send({
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
const getMoneyReceiptPDF = async (req, res) => {
  try {
    const { receiptId } = req.params;
    const orderId = req.orderId;

    // const order = await ORDER.findById(orderId).populate("client").lean();

    // if (!order) {
    //   return res.send({
    //     code: 404,
    //     error: "Client Not Found",
    //   });
    // }

    // const client = order.client;
    // const moneyReceipt = await MONEY_RECEIPT.findById(receiptId);

    // if (!moneyReceipt) {
    //   return res.send({
    //     code: 404,
    //     error: "Money Receipt Not Found",
    //   });
    // }

    // const template = await TEMPLATES.findOne({
    //   _id: mongoose.Types.ObjectId(moneyReceipt.template),
    // });

    // if (!template) {
    //   return res.send({
    //     code: 404,
    //     error: "Quotation Not Found",
    //   });
    // }

    const ejsfile = path.resolve(
      __dirname,
      "../",
      "Templates",
      "moneyReceipt.ejs"
    );
    const fs = require("fs");
    const abc = fs.readFileSync(ejsfile, { encoding: "utf-8" });
    const compiled = ejs.compile(abc, {
      compileDebug: true,
    });
    // const compiled = ejs.compile(template.templateHTML, {
    //   compileDebug: true,
    // });

    const data = {
      company_name: "",
      company_logo: "",
      company_email: "",
      website: "",
      address: "",
      mr_no: "",
      receipt_date: "",
      client_name: "",
      shifting_from: "",
      shifting_to: "",
      branch_name: "",
      consignment_no: "",
      date_arrival: "",
      no_articles: "",
      payment_mode: "",
      refrence_no: "",
      amount: "",
      amount: "",
    };

    const html = compiled({
      data,
    });

    const PDF_PATH = path.resolve(
      __dirname,
      "../",
      "Templates",
      "moneyReceipt.pdf"
    );
    let options = {
      format: "A4",
      path: PDF_PATH,
      printBackground: true,
      landscape: true,
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

module.exports = {
  createMoneyReceipt,
  getMoneyReceiptsByOrderId,
  getMoneyReceiptPDF,
};
