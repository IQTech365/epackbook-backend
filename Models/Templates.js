const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    data: {
      type: String,
      required: true,
    },
    templateType: {
      type: String,
      required: true,
      enum: ["quotation", "builty", "other"],
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

const TemplatesModel = mongoose.model("templates", schema);

module.exports = TemplatesModel;
