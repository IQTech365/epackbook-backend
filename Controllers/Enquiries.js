const ENQUIRY = require("../Models/Enquiries");

/**
 * @param { phone, email } req.body
 * @returns
 */
const createEnquiry = async (req, res) => {
  try {
    const values = { ...req.body };
    await ENQUIRY.create(values);
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
 * @returns enquiries
 */
const getEnquires = async (req, res) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 1;
    const instances = await ENQUIRY.find()
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
 * @param { enquiryId } req
 * @returns enquiry
 */
const getEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const instances = await ENQUIRY.findById(enquiryId).select("-__v").lean();
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
 * @param { enquiryId } req
 * @returns
 */
const updateEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const instance = await ENQUIRY.updateOne({ _id: enquiryId }, req.body);
    if (instance.modifiedCount) {
      res.send({
        code: 200,
        message: "Enquiry Updated Successfully",
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
  createEnquiry,
  getEnquires,
  getEnquiry,
  updateEnquiry,
};
