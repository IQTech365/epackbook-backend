const mongoose = require("mongoose");
const MONEY_RECEIPT = require("../Models/MoneyReceipt");
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

    await MONEY_RECEIPT.create(req.body);
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
    const { orderId } = req.params;
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

module.exports = {
  createMoneyReceipt,
  getMoneyReceiptsByOrderId,
};
