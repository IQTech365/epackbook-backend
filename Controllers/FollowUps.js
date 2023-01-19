const FOLLOWUP = require("../Models/FollowUp");

/**
 * @param { manager, followUpDate, nextFollowUpDate, comment, enquiry } req.body
 * @returns
 */
const createFollowup = async (req, res) => {
  try {
    const values = { ...req.body };
    await FOLLOWUP.create(values);
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
 * @returns followups
 */
const getFollowUps = async (req, res) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 1;
    const { enquiryId } = req.params;
    const instances = await FOLLOWUP.find({ enquiry: enquiryId })
      .select("-__v")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
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
  createFollowup,
  getFollowUps,
};
