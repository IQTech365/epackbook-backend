const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    company: {
      logo: {
        type: String,
        default: null,
      },
      profile: {
        type: String,
        default: null,
      },
      type: {
        trim: true,
        type: String,
        enum: [
          "PARTNERSHIP",
          "LLP",
          "SOLE_PROPRIETORSHIP",
          "PRIVATE_LIMITED",
          null,
        ],
        default: null,
      },
      name: {
        trim: true,
        type: String,
        default: null,
      },
      punchline: {
        trim: true,
        type: String,
        default: null,
      },
      ownerName: {
        trim: true,
        type: String,
        default: null,
      },
      tnc: {
        type: String,
        default: null,
      },
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
    documents: {
      gst: {
        type: String,
        default: null,
      },
      shopActNo: {
        type: String,
        default: null,
      },
      UdyamRegd: {
        type: String,
        default: null,
      },
      iso: {
        type: String,
        default: null,
      },
      pan: {
        type: String,
        default: null,
      },
      inc: {
        type: String,
        default: null,
      },
    },
    socials: {
      website: {
        trim: true,
        type: String,
        default: null,
      },
    },
    account: {
      bank: String,
      ifsc: String,
      holder: {
        name: String,
        number: String,
      },
      upi: {
        type: [
          {
            provider: String,
            id: String,
          },
        ],
        _id: false,
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
    isClientVerified: {
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

schema.pre("save", async function (next) {
  if (this.phone.alternates.length > 0) {
    const instances = this.phone.alternates.map((phone) => {
      console.log(phone.number);
      return this.constructor.countDocuments({
        $or: [
          { "phone.primary.number": phone.number },
          { "phone.alternates": { $elemMatch: { number: phone.number } } },
        ],
      });
    });
    const result = await Promise.all(instances);
    const isPhoneNumberAlreadyPresent = result.some((num) => num > 0);
    if (isPhoneNumberAlreadyPresent) {
      next(new Error("Phone number already exists"));
    }
  }
  next();
});

module.exports = model("clients", schema);
