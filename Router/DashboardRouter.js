const DashboardRouter = require("express").Router();
const { getDashboardStats } = require("../Controllers/Misseleneous");

DashboardRouter.get("/", getDashboardStats);

module.exports = DashboardRouter;
