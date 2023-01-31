const TEMPLATE = require("../Models/Templates");

/**
 * @param { data, templateType, description,previewImage } req.body
 * @returns
 */
const createTemplate = async (req, res) => {
  try {
    const values = { ...req.body };
    await TEMPLATE.create(values);
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
 * @returns template
 */
const getTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const instances = await TEMPLATE.findById(templateId)
      .select("-__v -isActive")
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
 * @param {*} req
 * @param {*} res
 * @returns templates
 */
const getTemplates = async (req, res) => {
  try {
    const instances = await TEMPLATE.find().select("-__v").lean();
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
  createTemplate,
  getTemplate,
  getTemplates,
};
