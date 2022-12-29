const BranchRouter = require("express").Router();
const {
  createBranch,
  getBranches,
  updateBranch,
} = require("../Controllers/Branches");

BranchRouter.get("/", getBranches);
BranchRouter.post("/", createBranch);
BranchRouter.patch("/:branchId", updateBranch);

module.exports = BranchRouter;
