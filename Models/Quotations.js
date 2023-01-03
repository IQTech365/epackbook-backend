const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    shiftingLuggage: {
      type: String,
      default: null,
    },
    template: {
      type: String,
      default: null,
    },
    quotation: {
      number: {
        type: String,
        default: null,
      },
      date: {
        type: String,
        default: null,
      },
      _id: false,
    },
    vehicle: {
      type: {
        type: String,
        default: null,
      },
      manufacturer: {
        type: String,
        default: null,
      },
      model: {
        type: String,
        default: null,
      },
      _id: false,
    },
    freightDetails: {
      type: Object,
      default: null,
    },
    transitInsurance: {
      isRequired: {
        type: Boolean,
        default: null,
      },
    },
    otherCharges: {
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
    toJSON: { virtuals: true },
  }
);

module.exports = mongoose.model("quotations", schema);
