const mongoose = require("mongoose");
const QUOTATION = require("../Models/Quotations");
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
    res.sendStatus(200);
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
      .populate("template")
      .populate("enquiry")
      .select("-__v")
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

module.exports = {
  createQuotation,
  getQuotationsByEnquiryId,
  getQuotationByEnquiryId,
};
