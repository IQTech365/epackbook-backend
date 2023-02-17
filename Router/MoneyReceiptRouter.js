const MoneyReceiptRouter = require("express").Router();
const {
  createMoneyReceipt,
  getMoneyReceiptsByOrderId,
} = require("../Controllers/MoneyReceipt");

MoneyReceiptRouter.get("/:orderId", getMoneyReceiptsByOrderId);
MoneyReceiptRouter.post("/", createMoneyReceipt);

module.exports = MoneyReceiptRouter;
