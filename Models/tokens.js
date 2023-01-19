const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tokenSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userType: {
      type: String,
      enum: ["client", "user", "admin", "customer"],
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("tokens", tokenSchema);
