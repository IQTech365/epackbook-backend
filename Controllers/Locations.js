const LocationsModel = require("../Models/Location");
const { sendErrorResponse, sendResponse } = require("../Utils/Utils");

/**
 * @field all
 */

const getLocations = async (req, res) => {
  try {
    let query = {};
    if (req.query.postalCode) {
      query = {
        "states.cities.postalCodes.postalCode": parseInt(req.query.postalCode),
      };
    }
    const data = await LocationsModel.findOne(
      query,
      "-isActive -__v -created_at -updated_at"
    );
    sendResponse(res, data);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @field Country
 */

const getCountries = async (req, res) => {
  try {
    const countries = await LocationsModel.aggregate([
      {
        $project: {
          _id: 1,
          country: "$country.name",
          cc: "$country.code",
        },
      },
    ]);
    sendResponse(res, countries);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createCountry = async (req, res) => {
  try {
    const { country, countryCode } = req.body;
    const instance = new LocationsModel({
      country: { name: country, code: countryCode },
    });
    await instance.save();
    res.sendStatus(200);
  } catch (error) {
    sendErrorResponse(
      res,
      error,
      "The field you are trying to create is already exists"
    );
  }
};

/**
 * @field State
 */

const getStates = async (req, res) => {
  try {
    const { countryName } = req.params;
    const instance = await LocationsModel.findOne(
      {
        "country.name": countryName.toLowerCase(),
      },
      "-_id states.name"
    ).lean();
    if (instance) {
      const transformedArr = instance.states.map(({ name }) => name);
      sendResponse(res, transformedArr);
    } else {
      throw new Error("Country doesn't exists");
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createState = async (req, res) => {
  try {
    const { state } = req.body;
    const { countryName } = req.params;
    // find and update state into country
    const country = await LocationsModel.findOne(
      {
        $and: [
          { "country.name": countryName.toLowerCase() },
          { isActive: false },
        ],
      },
      "name isActive states"
    );

    if (country) {
      const isStateExists = country.states.findIndex(
        (obj) => obj.name === state.toLowerCase()
      );
      if (isStateExists === -1) {
        country.states.push({ name: state });
        await country.save();
        return res.sendStatus(200);
      } else {
        throw new Error("State already exists");
      }
    } else {
      throw new Error(
        "The state you're trying to create doesn't have a valid country in records. Please create or activate related country first and then try again."
      );
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @field Cities
 */
const getCities = async (req, res) => {
  try {
    const { countryName, stateName } = req.params;
    const cities = await LocationsModel.find(
      {
        "country.name": countryName,
        "states.name": stateName.toLowerCase(),
        "states.cities.0.name": { $exists: true },
      },
      "country.name states._id states.name states.cities._id states.cities.name"
    ).lean();
    sendResponse(res, districts);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createCity = async (req, res) => {
  try {
    const { city } = req.body;
    const { countryName, stateName } = req.params;
    // find and update state into country
    const country = await LocationsModel.findOne(
      {
        $and: [
          { "country.name": countryName.toLowerCase() },
          { "states.name": stateName.toLowerCase() },
          { isActive: false },
        ],
      },
      "name isActive states"
    );

    if (country) {
      const stateIndex = country.states.findIndex(
        (obj) => obj.name === stateName.toLowerCase()
      );
      const isCityExists = country.states[stateIndex].cities.findIndex(
        (obj) => obj.name === city.toLowerCase()
      );
      if (isCityExists === -1) {
        country.states = country.states.map((state) => {
          if (state.name == stateName.toLowerCase()) {
            const newCity = { name: city };
            state.cities.push(newCity);
            return state;
          }
          return state;
        });

        const instance = await country.save();
        sendResponse(res);
      } else {
        throw new Error("City already exists");
      }
    } else {
      throw new Error(
        "The City you're trying to create doesn't have a valid country or state in records. Please create one or activate related country or state first and then try creating again."
      );
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @field Postal Code
 */
const createPostalCode = async (req, res) => {
  try {
    const { postalCode } = req.body;
    const { countryName, stateName, cityName } = req.params;
    // find and update state into country
    const country = await LocationsModel.findOne({
      $and: [
        { "country.name": { $eq: countryName.toLowerCase() } },
        { "states.name": { $eq: stateName.toLowerCase() } },
        {
          "states.cities.name": {
            $eq: cityName.toLowerCase(),
          },
        },
        { isActive: false },
      ],
    });

    if (country) {
      const stateIndex = country.states.findIndex(
        (obj) => obj.name === stateName.toLowerCase()
      );
      const cityIndex = country.states[stateIndex].cities.findIndex(
        (obj) => obj.name === cityName.toLowerCase()
      );
      const isPostalCodeExists = country.states[stateIndex].cities[
        cityIndex
      ].postalCodes.findIndex((obj) => obj.postalCode == postalCode);
      if (stateIndex >= 0 && cityIndex >= 0 && isPostalCodeExists === -1) {
        const newPostalCode = { postalCode };
        country.states = country.states.map((state) => {
          if (state.name == stateName.toLowerCase()) {
            state.cities[cityIndex].postalCodes.push(newPostalCode);
          }
          return state;
        });

        await country.save();
        res.sendStatus(200);
      } else {
        throw new Error("Postal-code already exists");
      }
    } else {
      throw new Error(
        "The postal-code you're trying to create doesn't have a valid country or state in records. Please create one or activate related country or state first and then try creating again."
      );
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @field Area
 */

module.exports = {
  getLocations,

  getCountries,
  createCountry,

  getStates,
  createState,

  getCities,
  createCity,

  createPostalCode,
};
