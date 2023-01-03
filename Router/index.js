const MainRouter = require("express").Router();
const AuthRouter = require("./AuthRouter");
const ClientRouter = require("./ClientRouter");
const BranchRouter = require("./BranchRouter");
const CustomerRouter = require("./CustomerRouter");
const EnquiryRouter = require("./EnquiryRouter");
const FollowUpsRouter = require("./FollowUpsRouter");
const SurveyRouter = require("./SurveyRouter");

MainRouter.use("/auth", AuthRouter);
MainRouter.use("/clients", ClientRouter);
MainRouter.use("/branches", BranchRouter);
MainRouter.use("/customers", CustomerRouter);
MainRouter.use("/enquiries", EnquiryRouter);
MainRouter.use("/followups", FollowUpsRouter);
MainRouter.use("/surveys", SurveyRouter);

module.exports = MainRouter;
