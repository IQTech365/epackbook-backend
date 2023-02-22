const LocationRouter = require("express").Router();
const { getLocations, createLocation } = require("../Controllers/Locations");
const { ValidateRequestBody } = require("../Middlewares");

// Location Routes
LocationRouter.get("/", getLocations);
LocationRouter.post("/", ValidateRequestBody, createLocation);

module.exports = LocationRouter;
