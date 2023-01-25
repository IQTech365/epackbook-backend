const TemplateRouter = require("express").Router();
const { createTemplate, getTemplate } = require("../Controllers/Templates");

TemplateRouter.get("/:templateId", getTemplate);
TemplateRouter.post("/", createTemplate);

module.exports = TemplateRouter;
