const chalk = require("chalk");
const morgan = require("morgan");
const { UserAuthValidator } = require("./Auth/User");
const { AdminAuthValidator } = require("./Auth/Admin");
const {
  AdminAndUserAuthMiddleware,
  AdminSellerAuthMiddleware,
} = require("./Auth/Common");
const { validationResult } = require("express-validator");

const morganChalkMiddleware = () =>
  morgan(function (tokens, req, res) {
    const resStatus = res.statusCode;
    return [
      chalk.bgGreen.black(tokens.method(req, res)),
      resStatus >= 200 && resStatus < 300
        ? chalk.green.bold(tokens.status(req, res))
        : resStatus >= 300 && resStatus < 400
        ? chalk.yellow.bold(tokens.status(req, res))
        : resStatus >= 400 && resStatus < 500
        ? chalk.red.bold(tokens.status(req, res))
        : null,
      chalk.yellow(tokens.url(req, res)),
      chalk.blue(tokens["response-time"](req, res) + " ms"),
      chalk.magenta("@ " + tokens.date(req, res)),
      chalk.yellow(tokens["remote-addr"](req, res)),
      chalk.yellow("from " + tokens.referrer(req, res)),
    ].join(" ");
  });

const ValidateRequestBody = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      code: 400,
      error: errors.array(),
    });
  } else {
    next();
  }
};

const modules = {
  morganChalkMiddleware,
  ValidateRequestBody,
  UserAuthValidator,
  AdminAuthValidator,
  AdminAndUserAuthMiddleware,
  AdminSellerAuthMiddleware,
};

module.exports = modules;
