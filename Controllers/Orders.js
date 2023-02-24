const ORDER = require("../Models/Orders");
const CUSTOMER = require("../Models/Customers");
const { doesContainRestrictedFields } = require("../Utils/helpers");

/**
 * @param req.body
 * @returns
 */
const createOrder = async (req, res) => {
  const RESTRICTED_FIELDS = ["isActive", "createdAt", "updatedAt", "comments"];
  try {
    // if upcoming values contains any restricted field then don't update
    const isContainRestrictedField = doesContainRestrictedFields(
      RESTRICTED_FIELDS,
      Object.keys(req.body)
    );
    if (isContainRestrictedField) {
      return res.sendStatus(403);
    }

    await ORDER.create(req.body);
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
 * @returns orders
 */
const getOrders = async (req, res) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 1;
    // const instances = await ORDER.find()
    const instances = await ORDER.find({ status: { $ne: "COMPLETED" } })
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
 * @queryParam { orderId } req
 * @param { body } req
 * @returns
 */

const updateOrder = async (req, res) => {
  const RESTRICTED_FIELDS = ["isActive", "createdAt", "updatedAt", "comments"];
  try {
    // if upcoming values contains any restricted field then don't update
    const isContainRestrictedField = doesContainRestrictedFields(
      RESTRICTED_FIELDS,
      Object.keys(req.body)
    );
    if (isContainRestrictedField) {
      return res.sendStatus(403);
    }

    const { orderId } = req.params;
    const values = req.body;
    const instance = await ORDER.findById(orderId);
    // const instance = await ORDER.updateOne({ _id: orderId }, values);
    // console.log(instance);
    if (instance) {
      instance.set(values);
      const data = await instance.save();
      // res.sendStatus(200);
      res.send({
        code: 200,
        data,
      });
    } else {
      res.send({
        code: 404,
        error: "Order not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

/**
 * Update order status
 */

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    let instance = null;

    if (status === "COMPLETED") {
      instance = await ORDER.findByIdAndUpdate({ _id: orderId }, { status });
      // TODO: fill all fields of customer
      await CUSTOMER.create({
        phone: {
          primary: {
            number: instance.mobile,
          },
        },
        email: instance.email,
      });
    } else {
      instance = await ORDER.findByIdAndUpdate({ _id: orderId }, { status });
    }

    if (instance) {
      res.send({
        code: 200,
        data: instance,
      });
    } else {
      res.status(404).json({
        code: 404,
        error: "Not Found",
      });
    }
  } catch (error) {
    if (error.code == 11000) {
      // duplicate customer phone number or email
      res.send({
        code: 400,
        error: "The order status is updated but the customer already exists",
      });
    } else {
      res.status(400).json({
        code: 400,
        error: error.message,
      });
    }
  }
};

/**
 * add order comments
 * @queryParam { orderId }
 * @param { body } req
 * @returns
 */

const createOrderComment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const values = req.body;
    const instance = await ORDER.findById(orderId, "comments");
    if (!instance) return res.send({ code: 404, message: "not found" });
    instance.comments.push(values);
    await instance.save();
    res.sendStatus(200);
  } catch (error) {
    return res.status(400).json({
      code: 400,
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  createOrderComment,
  updateOrderStatus,
};
