const LocationsModel = require("../Models/Location");
const { sendErrorResponse, sendResponse } = require("../Utils/Utils");

/**
 * @field all
 */

const getLocations = async (req, res) => {
  try {
    let data = null;
    if (req.query.postalCode) {
      data = await LocationsModel.find(
        {
          postalCode: parseInt(req.query.postalCode),
        },
        "-isActive -__v -created_at -updated_at"
      );
    } else {
      data = await LocationsModel.find(
        {},
        "-isActive -__v -created_at -updated_at"
      );
    }
    sendResponse(res, data);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @field Location
 */
const createLocation = async (req, res) => {
  try {
    const country = await LocationsModel.create(req.body);
    return res.send(country);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * UPload LOcations
 */

// const handleUploadLocations = async () => {
//   try {
//     const fs = require("fs");
//     const path = require("path");
//     const json = fs.readFileSync(path.join(__dirname, "file.txt"), "utf-8");
//     const data = JSON.parse(json);
//     const mutated = data.map((item) => {
//       return {
//         postOfficeName: item.PostOfficeName,
//         district: item.District,
//         postalCode: item.Pincode,
//         city: item.City,
//         state: item.State,
//         country: "india",
//       };
//     });

//     const pros = mutated.map((item) => LocationsModel.create(item));
//     const result = await Promise.all(pros);
//     res.send(result);
//   } catch (error) {
//     sendErrorResponse(res, error);
//   }
// };

module.exports = {
  getLocations,
  createLocation,
};
