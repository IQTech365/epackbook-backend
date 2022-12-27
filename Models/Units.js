const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    price_decision_factor: {
      type: String,
      enum: [],
      required: true,
    },
    description: {
      type: String,
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

const UnitsModel = mongoose.model("units", schema);

module.exports = UnitsModel;
