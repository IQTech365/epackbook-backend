const QuotationRouter = require("express").Router();
const {
  createQuotation,
  getQuotationsByEnquiryId,
  getQuotationByEnquiryId,
  getQuotationPDF,
} = require("../Controllers/Quotations");

QuotationRouter.get("/", getQuotationsByEnquiryId);
QuotationRouter.get("/:quotationId", getQuotationByEnquiryId);
QuotationRouter.get("/:quotationId/PDF", getQuotationPDF);
QuotationRouter.post("/", createQuotation);

module.exports = QuotationRouter;
