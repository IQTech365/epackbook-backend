const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: null,
    },
    shiftingType: {
      type: String,
      default: null,
    },
    enquirySource: {
      type: String,
      default: null,
    },
    contactPerson: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    mobile: {
      type: String,
      default: null,
    },
    shiftingLuggage: {
      type: [
        {
          type: String,
          default: null,
        },
      ],
      default: [],
    },
    shiftingDate: {
      type: Date,
      default: null,
    },
    surveyDateTime: {
      type: Date,
      default: null,
    },
    desc: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["approved", "under_process", "new"],
      default: "new",
    },
    pickupAddress: {
      shiftingFrom: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      street: {
        type: String,
        default: null,
      },
      landmark: {
        type: String,
        default: null,
      },
      currentFloor: {
        type: String,
        default: null,
      },
      postalCode: {
        type: String,
        default: null,
      },
      isLiftAvailable: {
        type: Boolean,
        default: false,
      },
    },
    dropAddress: {
      shiftingTo: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      street: {
        type: String,
        default: null,
      },
      landmark: {
        type: String,
        default: null,
      },
      destinationFloor: {
        type: String,
        default: null,
      },
      postalCode: {
        type: String,
        default: null,
      },
      isLiftAvailable: {
        type: Boolean,
        default: false,
      },
    },
    surveyer: {
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

module.exports = mongoose.model("enquiries", schema);
