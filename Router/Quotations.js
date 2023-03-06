const QuotationRouter = require("express").Router();
const {
  createQuotation,
  getQuotationsByEnquiryId,
  getQuotationByEnquiryId,
  getQuotationPDF,
  updateQuotation,
} = require("../Controllers/Quotations");

QuotationRouter.get("/", getQuotationsByEnquiryId);
QuotationRouter.get("/:quotationId", getQuotationByEnquiryId);
QuotationRouter.patch("/:quotationId", updateQuotation);
QuotationRouter.get("/:quotationId/PDF", getQuotationPDF);
QuotationRouter.post("/", createQuotation);

module.exports = QuotationRouter;
