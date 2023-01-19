const FollowUpsRouter = require("express").Router();
const { createFollowup, getFollowUps } = require("../Controllers/FollowUps");

FollowUpsRouter.get("/:enquiryId", getFollowUps);
FollowUpsRouter.post("/", createFollowup);

module.exports = FollowUpsRouter;
