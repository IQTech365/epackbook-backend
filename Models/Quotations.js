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
      freightCharges: {
        status: {
          type: String,
          enum: ["NOT_REQUIRED", "INCLUDED", "ADDITIONAL"],
          default: "NOT_REQUIRED",
        },
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
      packagingCharges: {
        status: {
          type: String,
          enum: ["NOT_REQUIRED", "INCLUDED", "ADDITIONAL"],
          default: "NOT_REQUIRED",
        },
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
        status: {
          type: String,
          enum: ["NOT_REQUIRED", "INCLUDED", "ADDITIONAL"],
          default: "NOT_REQUIRED",
        },
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
        status: {
          type: String,
          enum: ["NOT_REQUIRED", "INCLUDED", "ADDITIONAL"],
          default: "NOT_REQUIRED",
        },
        partLoadCharge: {
          type: Number,
          default: 0,
        },
        fullLoadCharge: {
          type: Number,
          default: 0,
        },
        unLoadingBy: {
          type: String,
          enum: ["COMPANY", "PARTY", null],
          default: null,
        },
        unLoadingFloor: {
          type: Number,
          default: null,
        },
        isLiftAvailable: {
          type: Boolean,
          default: null,
        },
        _id: false,
      },
      packingMaterialCharges: {
        status: {
          type: String,
          enum: ["NOT_REQUIRED", "INCLUDED", "ADDITIONAL"],
          default: "NOT_REQUIRED",
        },
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
        status: {
          type: String,
          enum: ["NOT_REQUIRED", "INCLUDED", "ADDITIONAL"],
          default: "NOT_REQUIRED",
        },
        partLoadCharge: {
          type: Number,
          default: 0,
        },
        fullLoadCharge: {
          type: Number,
          default: 0,
        },
        loadingBy: {
          type: String,
          enum: ["COMPANY", "PARTY", null],
          default: null,
        },
        loadingFloor: {
          type: Number,
          default: null,
        },
        isLiftAvailable: {
          type: Boolean,
          default: null,
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

schema.methods.getTotalFreightAmount = function (freightDetails) {
  // partLoadCharge
  const partLoadTotalFreightAmount = Object.entries(freightDetails)
    .map((item) => item[1].partLoadCharge)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  // fullLoadCharge
  const fullLoadTotalFreightAmount = Object.entries(freightDetails)
    .map((item) => item[1].fullLoadCharge)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return {
    partLoadTotal: Math.round(partLoadTotalFreightAmount),
    fullLoadTotal: Math.round(fullLoadTotalFreightAmount),
  };
};

schema.methods.getTotalOtherChargesAmount = function (otherCharges) {
  const result = otherCharges.reduce(
    (accumulator, currentValue) => accumulator + currentValue.amount,
    0
  );
  return Math.round(result);
};

schema.methods.getTotalSurchargeAmount = function (
  surcharge_percentage,
  total
) {
  return (surcharge_percentage / 10) * (total / 10);
};

schema.methods.getTotalWithoutGST = function (data) {
  const TotalFreight = data.getTotalFreightAmount(data.freightDetails);
  const totalStorageCharge = data.storageCharges.amount;
  const totalOtherCharges = data.getTotalOtherChargesAmount(data.otherCharges);

  const totalPartLoadAmountBeforeSurcharge =
    TotalFreight.partLoadTotal + totalStorageCharge + totalOtherCharges;
  const totalPartLoadSurcharge = data.getTotalSurchargeAmount(
    data.surcharge.charge,
    totalPartLoadAmountBeforeSurcharge
  );

  const totalFullLoadAmountBeforeSurcharge =
    TotalFreight.fullLoadTotal + totalStorageCharge + totalOtherCharges;
  const totalFullLoadSurcharge = data.getTotalSurchargeAmount(
    data.surcharge.charge,
    totalFullLoadAmountBeforeSurcharge
  );

  const partLoadTotal =
    TotalFreight.partLoadTotal +
    totalPartLoadSurcharge +
    totalStorageCharge +
    totalOtherCharges;

  const fullLoadTotal =
    TotalFreight.fullLoadTotal +
    totalFullLoadSurcharge +
    totalStorageCharge +
    totalOtherCharges;

  return {
    partLoadTotalAmount: Math.round(partLoadTotal),
    fullLoadTotalAmount: Math.round(fullLoadTotal),
  };
};

schema.virtual("totalGST").get(function () {
  const total = this.getTotalWithoutGST(this);
  const totalPartLoadGSTAmount =
    (this.gst.percentage / 10) * (total.partLoadTotalAmount / 10);
  const totalFullLoadGSTAmount =
    (this.gst.percentage / 10) * (total.fullLoadTotalAmount / 10);
  return {
    partLoadGST: Math.round(totalFullLoadGSTAmount),
    fullLoadGST: Math.round(totalPartLoadGSTAmount),
  };
});

schema.virtual("totalAmountExcludingGST").get(function () {
  const total = this.getTotalWithoutGST(this);
  return {
    partLoadTotalAmount: total.partLoadTotalAmount,
    fullLoadTotalAmount: total.fullLoadTotalAmount,
  };
});

schema.virtual("netTotal").get(function () {
  const total = this.getTotalWithoutGST(this);

  // calculating gst
  const overall = total.partLoadTotalAmount + total.fullLoadTotalAmount;
  const gst = (this.gst.percentage / 10) * (overall / 10);
  const netTotalIncludingGST = overall + gst;

  return Math.round(netTotalIncludingGST);
});

module.exports = mongoose.model("quotations", schema);
