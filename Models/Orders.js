const mongoose = require("mongoose");

const commentSchema = {
  shiftingManagerId: {
    type: mongoose.Types.ObjectId,
    required: true,
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
    name: {
      type: String,
      default: null,
    },
    mobile: {
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
    shifting: {
      luggage: {
        isHome: {
          type: Boolean,
          default: false,
        },
        isOffice: {
          type: Boolean,
          default: false,
        },
        isFactory: {
          type: Boolean,
          default: false,
        },
        isCar: {
          type: Boolean,
          default: false,
        },
        isBike: {
          type: Boolean,
          default: false,
        },
        isOrther: {
          type: Boolean,
          default: false,
        },
        _id: false,
      },
      type: {
        type: String,
        enum: ["local", "domestic", null],
        default: null,
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
