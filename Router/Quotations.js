const QuotationRouter = require("express").Router();
const {
  createQuotation,
  getQuotationsByEnquiryId,
  getQuotationByEnquiryId,
} = require("../Controllers/Quotations");

QuotationRouter.get("/", getQuotationsByEnquiryId);
QuotationRouter.get("/:quotationId", getQuotationByEnquiryId);
QuotationRouter.post("/", createQuotation);

module.exports = QuotationRouter;
