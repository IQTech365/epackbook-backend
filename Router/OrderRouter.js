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
const MoneyReceiptRouter = require("./MoneyReceiptRouter");

OrderRouter.get("/", getOrders);
OrderRouter.post("/", createOrder);
OrderRouter.patch("/:orderId", updateOrder);
OrderRouter.patch("/status/:orderId", updateOrderStatus);
OrderRouter.get("/:orderId/comments", getOrderComments);
OrderRouter.patch("/:orderId/comments", createOrderComment);
OrderRouter.get("/:customerId", getCompletedOrders);

// orders money receipts routes
OrderRouter.use(
  "/:orderId/money-receipts",
  function (req, res, next) {
    req.orderId = req.params.orderId;
    next();
  },
  MoneyReceiptRouter
);

module.exports = OrderRouter;
