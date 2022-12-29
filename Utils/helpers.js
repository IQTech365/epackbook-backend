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

function doesContainRestrictedFields(restrictedFieldsArr, upComingValuesArr) {
  let isContainRestrictedField = false;
  restrictedFieldsArr.forEach((field) => {
    if (upComingValuesArr.includes(field)) {
      isContainRestrictedField = true;
    }
  });
  return isContainRestrictedField;
}

module.exports = {
  generateJwtAccessToken,
  generateJwtRefreshToken,
  doesContainRestrictedFields,
};
