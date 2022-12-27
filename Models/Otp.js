const mongoose = require("mongoose");
const moment = require("moment");

const OtpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpType: {
      type: String,
      enum: ["login", "reset-password"],
      required: true,
      default: "login",
    },
    userRole: {
      type: String,
      enum: ["user", "deliveryBoy", "seller"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OtpSchema.methods = {
  isExpired: function (createdAt) {
    const limitMoment = moment(createdAt).add("3", "minutes");
    const dt = new Date().toISOString();
    return !moment(dt).isSameOrBefore(limitMoment);
  },
};

OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 500 });

module.exports = mongoose.model("otps", OtpSchema);
