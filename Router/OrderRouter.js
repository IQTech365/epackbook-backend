const OrderRouter = require("express").Router();
const {
  createOrder,
  getOrders,
  updateOrder,
  createOrderComment,
  updateOrderStatus,
  getOrderComments,
  getCompletedOrders,
} = require("../Controllers/Orders");

OrderRouter.get("/", getOrders);
OrderRouter.post("/", createOrder);
OrderRouter.patch("/:orderId", updateOrder);
OrderRouter.patch("/status/:orderId", updateOrderStatus);
OrderRouter.get("/:orderId/comments", getOrderComments);
OrderRouter.patch("/:orderId/comments", createOrderComment);
OrderRouter.get("/:customerId", getCompletedOrders);

module.exports = OrderRouter;
