const MainRouter = require("express").Router();
const AuthRouter = require("./AuthRouter");
const ClientRouter = require("./ClientRouter");
const BranchRouter = require("./BranchRouter");
const CustomerRouter = require("./CustomerRouter");

MainRouter.use("/auth", AuthRouter);
MainRouter.use("/clients", ClientRouter);
MainRouter.use("/branches", BranchRouter);
MainRouter.use("/customers", CustomerRouter);

module.exports = MainRouter;
