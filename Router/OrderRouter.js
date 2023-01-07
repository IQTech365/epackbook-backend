const OrderRouter = require("express").Router();
const {
  createOrder,
  getOrders,
  updateOrder,
} = require("../Controllers/Orders");

OrderRouter.get("/", getOrders);
OrderRouter.post("/", createOrder);
OrderRouter.patch("/:orderId", updateOrder);

module.exports = OrderRouter;
