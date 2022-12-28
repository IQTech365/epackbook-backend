const CLIENT = require("../Models/Clients");

/**
 async (req,res) => {
    try {

    } catch (error) {
        res.status(400).json({
            code: 400,
            error: error.message
        })
    }
}
 */

const createClient = async (req, res) => {
  try {
    const { phone, email } = req.body;
    await CLIENT.create({ phone, email });
    res.sendStatus(200);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({
        code: 401,
        error: `Field ${Object.keys(error.keyValue)[0]} already exists`,
      });
    }
    return res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

/**
 * @queryParam { skip, limit } req
 * @param { body } res
 * @returns
 */
const getClients = async (req, res) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 1;
    const instances = await CLIENT.find()
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

module.exports = {
  createClient,
  getClients,
};
