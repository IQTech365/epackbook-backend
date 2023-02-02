const EnquiryRouter = require("express").Router();
const {
  createEnquiry,
  getEnquires,
  getEnquiry,
  updateEnquiry,
} = require("../Controllers/Enquiries");

EnquiryRouter.get("/:enquiryId", getEnquiry);
EnquiryRouter.get("/", getEnquires);
EnquiryRouter.post("/", createEnquiry);
EnquiryRouter.patch("/:enquiryId", updateEnquiry);

module.exports = EnquiryRouter;
