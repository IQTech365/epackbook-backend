const jwt = require("jsonwebtoken");

const AdminAuthValidator = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.send({ code: 401, error: "You are not authorized" });
  }

  /* Validate token */
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.userType = payload.userType;
    req.user = payload._id;
    next();
  } catch (err) {
    if (err?.code === 404) {
      return res.send({ code: err.code, message: "Invalid admin" });
    }
    res.send({ code: 403, error: "Invalid token" });
    // console.log(err);
  }
};

module.exports = {
  AdminAuthValidator,
};
