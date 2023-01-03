const SurveyRouter = require("express").Router();
const { createSurvey, getSurveys } = require("../Controllers/Surveys");

SurveyRouter.get("/", getSurveys);
SurveyRouter.post("/", createSurvey);

module.exports = SurveyRouter;
