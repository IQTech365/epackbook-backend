const OrderRouter = require("express").Router();
const {
  createOrder,
  getOrders,
  updateOrder,
  createOrderComment,
  updateOrderStatus,
} = require("../Controllers/Orders");

OrderRouter.get("/", getOrders);
OrderRouter.post("/", createOrder);
OrderRouter.patch("/:orderId", updateOrder);
OrderRouter.patch("/status/:orderId", updateOrderStatus);
OrderRouter.post("/comments/:orderId", createOrderComment);

module.exports = OrderRouter;
