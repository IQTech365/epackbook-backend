const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    receiptNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    dateOfReceipt: {
      type: Date,
      default: null,
    },
    template: {
      type: String,
      default: null,
    },
    paymentType: {
      type: String,
      enum: ["advance", "part", "final"],
      required: true,
    },
    receiptAgainst: {
      type: String,
      default: null,
    },
    quotationNumber: {
      type: Number,
      default: null,
    },
    consignmentNumber: {
      type: Number,
      default: null,
    },
    noOfArticles: {
      type: Number,
      default: null,
    },
    dateOfArrival: {
      type: Date,
      default: null,
    },
    pamentMode: {
      type: String,
      default: null,
    },
    referrenceNumber: {
      type: Number,
      default: null,
    },
    amount: {
      type: Number,
      default: null,
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

module.exports = mongoose.model("receipts", schema);
