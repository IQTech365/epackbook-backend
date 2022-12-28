const AuthRouter = require("express").Router();
const {
  RequestAuthOtp,
  VerifyOtp,
  CompleteUserProfile,
  // RegisterSeller,
  AdminLogin,
  SessionUser,
  GetAccessToken,
} = require("../Controllers/Auth");

AuthRouter.post("/request-auth-otp", RequestAuthOtp);
AuthRouter.post("/verify-otp", VerifyOtp);
AuthRouter.post("/access-token", GetAccessToken);
AuthRouter.post("/complete-user-profile", CompleteUserProfile);
// AuthRouter.post('/register-seller', RegisterSeller);
AuthRouter.post("/signin/admin", AdminLogin);
AuthRouter.post("/session", SessionUser);

module.exports = AuthRouter
