const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    receiptNumber: {
      type: String,
      required: true,
    },
    referenceNumber: {
      type: String,
      default: null,
    },
    receiptDate: {
      type: Date,
      required: true,
    },
    arivalDate: {
      type: Date,
      default: null,
    },
    // template: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "templates",
    //   //   required: true,`
    // },
    receiptAgainst: {
      type: String,
      default: null,
    },
    billNumber: {
      type: String,
      default: null,
    },
    quotationNumber: {
      type: String,
      default: null,
    },
    consignmentNumber: {
      type: String,
      default: null,
    },
    numbersOfArticles: {
      type: String,
      default: null,
    },
    payment: {
      mode: {
        // cash, cheque, upi, DD, net banking
        type: String,
        default: null,
      },
      type: {
        type: String,
        enum: ["ADVANCE", "PART", "FINAL"],
        default: null,
      },
      amount: {
        type: String,
        default: null,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("money_receipts", schema);
