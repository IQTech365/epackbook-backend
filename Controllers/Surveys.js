const SURVEY = require("../Models/Survey");

/**
 * @param { manager, surveyDate, nextFollowUpDate, comment } req.body
 * @returns
 */
const createSurvey = async (req, res) => {
  try {
    const values = { ...req.body };
    await SURVEY.create(values);
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
 * @returns surveys
 */
const getSurveys = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 1;
    const instances = await SURVEY.find({ enquiry: enquiryId })
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
  createSurvey,
  getSurveys,
};
