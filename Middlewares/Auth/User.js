// Importing Packages
const jwt = require("jsonwebtoken");
// Importing Models
const UsersModel = require("../../Models/Users");

// UserAuthMiddleware
const UserAuthValidator = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (bearerToken) {
    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    if (decoded && decoded.userType === "user") {
      const user = await UsersModel.findOne({ _id: decoded.id });
      if (user) {
        if (user.accessToken === bearerToken.split(" ")[1]) {
          req.user = decoded.id;
          req.userType = decoded.userType;
          next();
        } else {
          return res.send({
            code: 401,
            error: "You are not Authorized to access this route.",
          });
        }
      } else {
        return res.send({
          code: 404,
          error: "Invalid User.",
        });
      }
    } else {
      return res.send({
        code: 401,
        error: "You are not Authorized to access this route.",
      });
    }
  } else {
    return res.send({
      code: 401,
      error: "Invaid Token.",
    });
  }
};

module.exports = {
  UserAuthValidator,
};
