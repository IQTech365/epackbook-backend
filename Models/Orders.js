const mongoose = require("mongoose");

const commentSchema = {
  shiftingManager: {
    type: mongoose.Types.ObjectId,
    // required: true,
    default: null,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date().toISOString(),
  },
};

const schema = new mongoose.Schema(
  {
    // name: {
    //   type: String,
    //   default: null,
    // },
    client: {
      type: mongoose.Types.ObjectId,
      ref: "clients",
      required: true,
    },
    companyName: {
      type: String,
      default: null,
    },
    contactPerson: {
      type: String,
      default: null,
    },
    shiftingSupervisor: {
      type: String,
      default: null,
    },
    carriageVhicle: {
      type: String,
      default: null,
    },
    mobile: {
      type: Number,
      default: null,
    },
    phone: {
      type: Number,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    quotationAmount: {
      type: Number,
      default: null,
    },
    orderAmount: {
      type: Number,
      default: null,
    },
    tokenAmount: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["COMPLETED", "UNDER_PROCESS", "NEW", "CANCELLED", "PENDING"],
      default: "NEW",
    },
    shifting: {
      date: {
        type: Date,
        default: null,
      },
      luggage: {
        type: [
          {
            type: String,
            enum: ["HOME", "OFFICE", "VEHICLE", "OTHER", "INDUSTRIAL"],
          },
        ],
        default: [],
      },
      type: {
        type: String,
        enum: ["LOCAL", "DOMESTIC"],
        required: true,
      },
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
      country: {
        type: String,
        default: "india",
      },
      landmark: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      district: {
        type: String,
        default: null,
      },
      postOffice: {
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
      city: {
        type: String,
        default: null,
      },
      district: {
        type: String,
        default: null,
      },
      postOffice: {
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
      country: {
        type: String,
        default: "india",
      },
      isLiftAvailable: {
        type: Boolean,
        default: false,
      },
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("orders", schema);
