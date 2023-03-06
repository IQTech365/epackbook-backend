// Models
const USER = require("../Models/Users");
const TEMPLATE = require("../Models/Templates");

// Utils
// const {
//   OTPgenerator,
//   usernameGenerator,
//   sendSellerResponse,
//   sendUserResponse,
//   sendErrorResponse,
//   sendResponse,
//   sendAdminResponse,
// } = require("../Utils/Utils");
// const { Logger } = require("../Utils/Loggers");

// Dashboard init api
const getDashboardStats = async (req, res) => {
  try {
    const templates = await TEMPLATE.find(
      { isActive: true }
      // "name templateType description"
    ).lean();
    res.send({
      code: 200,
      data: {
        templates,
      },
    });
  } catch (error) {}
};

module.exports = {
  getDashboardStats,
};
