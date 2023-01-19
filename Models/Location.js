const mongoose = require("mongoose");

/* 
TODO: feed up indian cities and pincodes with below json
https://raw.githubusercontent.com/mithunsasidharan/India-Pincode-Lookup/master/pincodes.json
*/

const postalCodeSchema = {
  postalCode: {
    type: String,
    lowercase: true,
  },
  areas: {
    type: Array,
    default: [],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
};

const citySchema = {
  name: {
    type: String,
    lowercase: true,
  },
  postalCodes: [postalCodeSchema],
  isActive: {
    type: Boolean,
    default: false,
  },
};

const stateSchema = {
  name: {
    type: String,
    lowercase: true,
  },
  cities: {
    type: [citySchema],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
};

const countrySchema = {
  name: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
};

const schema = new mongoose.Schema(
  {
    country: countrySchema,
    states: {
      type: [stateSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const LocationsModel = mongoose.model("locations", schema);

module.exports = LocationsModel;
