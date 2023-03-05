const EnquiryRouter = require("express").Router();
const {
  createEnquiry,
  getEnquires,
  getEnquiry,
  updateEnquiry,
  updateEnquiryStatus,
} = require("../Controllers/Enquiries");
const QuotationRouter = require("./Quotations");

function varifyClient(req, res, next) {
  req.user = "640088f310f31ff6eb40039a";
  next();
}

EnquiryRouter.get("/:enquiryId", varifyClient, getEnquiry);
EnquiryRouter.get("/", varifyClient, getEnquires);
EnquiryRouter.post("/", varifyClient, createEnquiry);
EnquiryRouter.patch("/:enquiryId", varifyClient, updateEnquiry);
EnquiryRouter.patch("/status/:enquiryId", varifyClient, updateEnquiryStatus);

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
