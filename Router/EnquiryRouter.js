const EnquiryRouter = require("express").Router();
const {
  createEnquiry,
  getEnquires,
  getEnquiry,
} = require("../Controllers/Enquiries");

EnquiryRouter.get("/:enquiryId", getEnquiry);
EnquiryRouter.get("/", getEnquires);
EnquiryRouter.post("/", createEnquiry);

module.exports = EnquiryRouter;
