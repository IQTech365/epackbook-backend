const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userType: {
      type: String,
      enum: ["client", "customer", "admin"],
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    device: {
      type: Object,
      default: null,
    },
    ExpireOn: {
      type: Date,
      required: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

SessionSchema.index({ ExpireOn: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("sessions", SessionSchema);
