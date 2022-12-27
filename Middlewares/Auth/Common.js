// Importing Packages
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// Importing Models
const UsersModel = require("../../Models/Users");

// Common Auth validator for user and admin
const AdminAndUserAuthMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.send({ code: 401, error: "You are not authorized" });
  }

  /* Validate token */
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (payload.userType == "user") {
      const user = await UsersModel.findOne({
        _id: mongoose.Types.ObjectId(payload.id),
      });
      if (user) {
        req.user = user._id;
        req.userType = payload.userType;
        next();
      } else {
        return res.send({
          code: 401,
          error: "You are not Authorized to access this Route.",
        });
      }
    } else if (payload.userType == "admin") {
      req.user = payload.id;
      req.userType = payload.userType;
      next();
    } else {
      return res.send({
        code: 401,
        error: "You are not Authorized.",
      });
    }
  } catch (err) {
    if (err?.code === 404) {
      return res.send({ code: err.code, message: "Invalid User" });
    }
    res.send({ code: 401, error: "Invalid token" });
    // console.log(err);
  }
};

module.exports = { AdminAndUserAuthMiddleware };
