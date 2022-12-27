const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    firstName: {
      trim: true,
      type: String,
      default: null,
    },
    lastName: {
      trim: true,
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", null],
      default: null,
    },
    dob: {
      type: Date,
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
      secondary: {
        cc: {
          type: String,
          default: "+91",
        },
        number: {
          type: String,
          unique: [true, "Please use different mobile number"],
          default: null,
        },
      },
    },
    email: {
      type: String,
      default: null,
      unique: [true, "Please use different email"],
    },
    profileImg: {
      type: String,
      default: "https://martcues-public.s3.amazonaws.com/user-default-profile",
    },
    billingAddress: {
      street_one: {
        type: String,
        lowercase: true,
        trim: true,
        default: null,
      },
      street_two: {
        type: String,
        lowercase: true,
        trim: true,
        default: null,
      },
      addressType: {
        enum: ["billing", "shipping"],
        type: String,
        default: "billing",
      },
      location: {
        location_type: {
          enum: ["home", "office", "other"],
          type: String,
          default: "home",
        },
        coordinates: {
          lat: String,
          lon: String,
        },
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
      district: {
        type: String,
        lowercase: true,
        default: null,
        trim: true,
      },
      postalCode: {
        type: String,
        lowercase: true,
        default: null,
        trim: true,
      },
    },
    shippingAddresses: [
      {
        street_one: {
          type: String,
          lowercase: true,
          trim: true,
          default: null,
        },
        street_two: {
          type: String,
          lowercase: true,
          trim: true,
          default: null,
        },
        location: {
          location_type: {
            enum: ["home", "office", "other"],
            type: String,
            default: "home",
          },
          coordinates: {
            lat: {
              type: String,
              default: null,
            },
            lon: {
              type: String,
              default: null,
            },
          },
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
        district: {
          type: String,
          lowercase: true,
          default: null,
          trim: true,
        },
        postalCode: {
          type: String,
          lowercase: true,
          default: null,
          trim: true,
        },
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isUserVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isTncAccepted: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

schema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const Users = model("users", schema);

module.exports = Users;
