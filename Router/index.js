const MainRouter = require("express").Router();
const AuthRouter = require("./AuthRouter");
const ClientRouter = require("./ClientRouter");
const BranchRouter = require("./BranchRouter");
const CustomerRouter = require("./CustomerRouter");
const EnquiryRouter = require("./EnquiryRouter");
const FollowUpsRouter = require("./FollowUpsRouter");
const SurveyRouter = require("./SurveyRouter");
const OrderRouter = require("./OrderRouter");
const MoneyReceiptRouter = require("./MoneyReceipt");
const LocationRouter = require("./LocationRouter");

MainRouter.use("/auth", AuthRouter);
MainRouter.use("/clients", ClientRouter);
MainRouter.use("/branches", BranchRouter);
MainRouter.use("/customers", CustomerRouter);
MainRouter.use("/enquiries", EnquiryRouter);
MainRouter.use("/followups", FollowUpsRouter);
MainRouter.use("/surveys", SurveyRouter);
MainRouter.use("/orders", OrderRouter);
MainRouter.use("/receipts", MoneyReceiptRouter);
MainRouter.use("/locations", LocationRouter);

module.exports = MainRouter;
