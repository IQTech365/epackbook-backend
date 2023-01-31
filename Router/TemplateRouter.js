const TemplateRouter = require("express").Router();
const {
  createTemplate,
  getTemplate,
  getTemplates,
} = require("../Controllers/Templates");

TemplateRouter.get("/", getTemplates);
TemplateRouter.get("/:templateId", getTemplate);
TemplateRouter.post("/", createTemplate);

module.exports = TemplateRouter;
