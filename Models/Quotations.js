const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    quotation: {
      number: {
        type: Number,
        default: null,
      },
      date: {
        type: Date,
        default: null,
      },
      _id: false,
    },
    vehicle: {
      type: {
        type: String,
        enum: ["CAR", "BIKE", null],
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
    enquiry: {
      type: mongoose.Types.ObjectId,
      ref: "enquiries",
      required: true,
    },
    luggageType: {
      type: String,
      enum: ["VEHICLE", "HOUSE_HOLD"],
      required: true,
    },
    template: {
      type: mongoose.Types.ObjectId,
      ref: "templates",
      required: true,
    },
    freightDetails: {
      packagingCharges: {
        partLoadCharge: {
          type: Number,
          default: 0,
        },
        fullLoadCharge: {
          type: Number,
          default: 0,
        },
        _id: false,
      },
      unPackagingCharges: {
        partLoadCharge: {
          type: Number,
          default: 0,
        },
        fullLoadCharge: {
          type: Number,
          default: 0,
        },
        _id: false,
      },
      unLoadingCharges: {
        partLoadCharge: {
          type: Number,
          default: 0,
        },
        fullLoadCharge: {
          type: Number,
          default: 0,
        },
        _id: false,
      },
      packingMaterialCharges: {
        partLoadCharge: {
          type: Number,
          default: 0,
        },
        fullLoadCharge: {
          type: Number,
          default: 0,
        },
        _id: false,
      },
      loadingCharges: {
        partLoadCharge: {
          type: Number,
          default: 0,
        },
        fullLoadCharge: {
          type: Number,
          default: 0,
        },
        _id: false,
      },
      _id: false,
    },
    gst: {
      status: {
        type: String,
        default: null,
      },
      type: {
        type: String,
        default: null,
      },
      percentage: {
        type: Number,
        default: null,
      },
    },
    surcharge: {
      type: {
        type: String,
        default: null,
      },
      charge: {
        type: Number,
        default: null,
      },
    },
    transitInsurance: {
      charges: {
        type: [
          {
            luggageType: String,
            insurancePerc: Number,
            value: Number,
            total: Number,
          },
        ],
        default: [],
      },
      _id: false,
    },
    storageCharges: {
      fromDate: {
        type: Date,
        default: null,
      },
      toDate: {
        type: Date,
        default: null,
      },
      amount: {
        type: Number,
        default: null,
      },
      _id: false,
    },
    otherCharges: {
      type: [
        {
          field: String,
          amount: Number,
        },
      ],
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
