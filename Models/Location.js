const mongoose = require("mongoose");

/* 
TODO: feed up indian cities and pincodes with below json
https://raw.githubusercontent.com/mithunsasidharan/India-Pincode-Lookup/master/pincodes.json
*/

const new_schema = new mongoose.Schema(
  {
    postOfficeName: {
      type: String,
      default: null,
    },
    district: {
      type: String,
      default: null,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const LocationsModel = mongoose.model("locations", new_schema);

module.exports = LocationsModel;
