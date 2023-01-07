const MoneyReceiptRouter = require("express").Router();
const { createReceipt, getReceipts } = require("../Controllers/Receipts");

MoneyReceiptRouter.post("/", createReceipt);
MoneyReceiptRouter.get("/", getReceipts);

module.exports = MoneyReceiptRouter;
