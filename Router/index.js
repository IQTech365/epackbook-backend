const MainRouter = require("express").Router();
const AuthRouter = require("./AuthRouter");
const ClientRouter = require("./ClientRouter");
const BranchRouter = require("./BranchRouter");

MainRouter.use("/auth", AuthRouter);
MainRouter.use("/clients", ClientRouter);
MainRouter.use("/branches", BranchRouter);

module.exports = MainRouter;
