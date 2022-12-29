const ClientRouter = require("express").Router();
const {
  createClient,
  getClients,
  updateClient,
} = require("../Controllers/Clients");

ClientRouter.get("/", getClients);
ClientRouter.post("/", createClient);
ClientRouter.patch("/:clientId", updateClient);

module.exports = ClientRouter;
