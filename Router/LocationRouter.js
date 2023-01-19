const LocationRouter = require("express").Router();
const {
  createCountry,
  createCity,
  createPostalCode,
  createState,
  getCountries,
  getCities,
  getLocations,
  getStates,
} = require("../Controllers/Locations");
const { ValidateRequestBody } = require("../Middlewares");

// Location Routes
LocationRouter.get("/", getLocations);

LocationRouter.get("/countries", getCountries);
LocationRouter.post("/countries", ValidateRequestBody, createCountry);

LocationRouter.get("/states/:countryName", getStates);
LocationRouter.patch("/states/:countryName", ValidateRequestBody, createState);

LocationRouter.get("/cities/:countryName/:stateName", getCities);
LocationRouter.patch(
  "/cities/:countryName/:stateName",
  ValidateRequestBody,
  createCity
);

LocationRouter.patch(
  "/postal-codes/:countryName/:stateName/:cityName",
  ValidateRequestBody,
  createPostalCode
);

module.exports = LocationRouter;
