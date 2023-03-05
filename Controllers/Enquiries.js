const ENQUIRY = require("../Models/Enquiries");
const ORDER = require("../Models/Orders");

/**
 * @param { phone, email } req.body
 * @returns
 */
const createEnquiry = async (req, res) => {
  try {
    const values = { ...req.body };
    const clientId = "640088f310f31ff6eb40039a";
    // const clientId = req.user;
    await ENQUIRY.create(Object.assign(values, { client: clientId }));
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
    // const instances = await ENQUIRY.find({ status: { $ne: "APPROVED" } })
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

const updateEnquiryStatus = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const { status } = req.body;
    // const instance = await ENQUIRY.updateOne({ _id: enquiryId }, { status });
    if (status === "APPROVED") {
      instance = await ENQUIRY.findByIdAndUpdate(
        { _id: enquiryId },
        { status }
      );
      await ORDER.create({
        email: instance.email,
        mobile: instance.mobile,
        phone: instance.phone,
        pickupAddress: instance.pickupAddress,
        dropAddress: instance.dropAddress,
        shifting: {
          luggage: instance.shiftingLuggage,
          type: instance.shiftingType,
        },
      });

      // TODO: create an order here
    } else {
      instance = await ENQUIRY.findByIdAndUpdate(
        { _id: enquiryId },
        { status }
      );
    }

    if (instance) {
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
  updateEnquiryStatus,
};
