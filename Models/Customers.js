const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: {
      trim: true,
      type: String,
      default: null,
    },
    phone: {
      primary: {
        cc: {
          type: String,
          required: true,
          set: function (cc) {
            return /\+[\d]{2,}/.test(cc) ? cc : `+${cc}`;
          },
          default: "+91",
        },
        number: {
          type: String,
          required: [true, "Mobile Number is required"],
          unique: [true, "Please use different mobile number"],
        },
      },
      alternates: {
        type: [
          {
            cc: {
              type: String,
              default: "+91",
            },
            number: {
              type: String,
              default: null,
            },
          },
        ],
        _id: false,
      },
    },
    email: {
      type: String,
      default: null,
      unique: [true, "Please use different email"],
    },
    address: {
      street: {
        type: String,
        lowercase: true,
        trim: true,
        default: null,
      },
      landmark: {
        type: String,
        lowercase: true,
        trim: true,
        default: null,
      },
      country: {
        type: String,
        lowercase: true,
        trim: true,
        default: null,
      },
      state: {
        type: String,
        lowercase: true,
        default: null,
        trim: true,
      },
      city: {
        type: String,
        lowercase: true,
        default: null,
        trim: true,
      },
      pincode: {
        type: String,
        lowercase: true,
        default: null,
        trim: true,
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isCustomerVerified: {
      type: Boolean,
      default: false,
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

module.exports = model("customers", schema);
