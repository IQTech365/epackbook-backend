const MoneyReceiptRouter = require("express").Router();
const {
  createMoneyReceipt,
  getMoneyReceiptsByOrderId,
  getMoneyReceiptPDF,
} = require("../Controllers/MoneyReceipt");

MoneyReceiptRouter.get("/", getMoneyReceiptsByOrderId);
MoneyReceiptRouter.post("/", createMoneyReceipt);
MoneyReceiptRouter.get("/:receiptId/PDF", getMoneyReceiptPDF);

module.exports = MoneyReceiptRouter;
