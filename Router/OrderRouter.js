const OrderRouter = require("express").Router();
const {
  createOrder,
  getOrders,
  updateOrder,
  createOrderComment,
} = require("../Controllers/Orders");

OrderRouter.get("/", getOrders);
OrderRouter.post("/", createOrder);
OrderRouter.post("/:orderId", updateOrder);
OrderRouter.post("/comments/:orderId", createOrderComment);

module.exports = OrderRouter;
