const CustomerRouter = require("express").Router();
const {
  createCustomer,
  getCustomers,
  updateCustomer,
} = require("../Controllers/Customers");

CustomerRouter.get("/", getCustomers);
CustomerRouter.post("/", createCustomer);
CustomerRouter.patch("/:customerId", updateCustomer);

module.exports = CustomerRouter;
