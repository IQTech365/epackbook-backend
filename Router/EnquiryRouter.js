const EnquiryRouter = require("express").Router();
const {
  createEnquiry,
  getEnquires,
  getEnquiry,
  updateEnquiry,
  updateEnquiryStatus,
} = require("../Controllers/Enquiries");
const QuotationRouter = require("./Quotations");

EnquiryRouter.get("/:enquiryId", getEnquiry);
EnquiryRouter.get("/", getEnquires);
EnquiryRouter.post("/", createEnquiry);
EnquiryRouter.patch("/:enquiryId", updateEnquiry);
EnquiryRouter.patch("/status/:enquiryId", updateEnquiryStatus);

/** Quotation Routes */
EnquiryRouter.use(
  "/:enquiryId/quotations",
  function (req, res, next) {
    req.enquiryId = req.params.enquiryId;
    next();
  },
  QuotationRouter
);

module.exports = EnquiryRouter;
