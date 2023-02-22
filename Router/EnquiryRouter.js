const EnquiryRouter = require("express").Router();
const {
  createEnquiry,
  getEnquires,
  getEnquiry,
  updateEnquiry,
  updateEnquiryStatus,
} = require("../Controllers/Enquiries");

EnquiryRouter.get("/:enquiryId", getEnquiry);
EnquiryRouter.get("/", getEnquires);
EnquiryRouter.post("/", createEnquiry);
EnquiryRouter.patch("/:enquiryId", updateEnquiry);
EnquiryRouter.patch("/status/:enquiryId", updateEnquiryStatus);

module.exports = EnquiryRouter;
