const ClientRouter = require("express").Router();
const {
  createClient,
  getClients,
  updateClient,
  getClient
} = require("../Controllers/Clients");

ClientRouter.get("/", getClients);
ClientRouter.get("/:clientId", getClient);
ClientRouter.post("/", createClient);
ClientRouter.patch("/:clientId", updateClient);

module.exports = ClientRouter;
