const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    manager: {
      type: String,
      required: true,
    },
    surveyDate: {
      type: Date,
      required: true,
    },
    nextFollowUpDate: {
      type: Date,
      default: null,
    },
    comment: {
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
    toJSON: { virtuals: true },
  }
);

module.exports = mongoose.model("surveys", schema);
