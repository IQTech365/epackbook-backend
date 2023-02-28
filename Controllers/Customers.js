const CUSTOMER = require("../Models/Customers");
const { doesContainRestrictedFields } = require("../Utils/helpers");

/**
 * @param { phone, email } req.body
 * @returns
 */
const createCustomer = async (req, res) => {
  try {
    const { phone, email } = req.body;
    await CUSTOMER.create({ phone, email });
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
 * @returns clients
 */
const getCustomers = async (req, res) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const instances = await CUSTOMER.find()
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
 * @queryParam { customerId } req
 * @param { body } req
 * @returns
 */

const updateCustomer = async (req, res) => {
  const RESTRICTED_FIELDS = [
    "isEmailVerified",
    "isPhoneVerified",
    "isCustomerVerified",
    "isActive",
    "createdAt",
    "updatedAt",
    "email",
    "phone",
  ];

  try {
    // if upcoming values contains any restricted field then don't update
    const isContainRestrictedField = doesContainRestrictedFields(
      RESTRICTED_FIELDS,
      Object.keys(req.body)
    );
    if (isContainRestrictedField) {
      return res.sendStatus(403);
    }

    const { customerId } = req.params;
    const values = req.body;
    const instance = await CUSTOMER.updateOne({ _id: customerId }, values);
    if (instance.modifiedCount) {
      res.sendStatus(200);
    } else {
      res.send({
        code: 404,
        error: "Customer not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
};
