const ClientRouter = require("express").Router();
const { createClient, getClients } = require("../Controllers/Clients");

ClientRouter.get("/", getClients);
ClientRouter.post("/", createClient);

module.exports = ClientRouter;
