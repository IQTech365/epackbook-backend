const MainRouter = require("express").Router();
const AuthRouter = require("./AuthRouter");
const ClientRouter = require("./ClientRouter");

MainRouter.use("/auth", AuthRouter);
MainRouter.use("/clients", ClientRouter);

module.exports = MainRouter;
