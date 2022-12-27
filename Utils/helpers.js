const jwt = require("jsonwebtoken");

function generateJwtAccessToken(payload = {}) {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRATION,
  });
}

function generateJwtRefreshToken(payload = {}) {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
  });
}

module.exports = {
  generateJwtAccessToken,
  generateJwtRefreshToken,
};
