const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    templateHTML: {
      type: String,
      required: true,
    },
    templateType: {
      type: String,
      required: true,
      enum: ["QUOTATION", "BUILTY", "OTHER"],
    },
    previewImage: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    injectionFields: {
      type: [],
      default: [],
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
