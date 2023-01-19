// Importing Packages
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const moment = require("moment");
// Models
const OtpModel = require("../Models/Otp");
const UsersModel = require("../Models/Users");
const SessionModal = require("../Models/Sessions");
const AdminModel = require("../Models/Admins");
// const DevicesModel = require("../Models/Devices");

// Utils
const {
  OTPgenerator,
  usernameGenerator,
  sendSellerResponse,
  sendUserResponse,
  sendErrorResponse,
  sendResponse,
  sendAdminResponse,
} = require("../Utils/Utils");
// Validators
const {
  LoginValidator,
  VerifyOtpValidator,
  SellerRegisterValidator,
  SellerLoginValidator,
} = require("../Utils/Validators");
const { Logger } = require("../Utils/Loggers");
// Middlewares
const { ValidateRequestBody, UserAuthValidator } = require("../Middlewares");
const {
  generateJwtAccessToken,
  generateJwtRefreshToken,
} = require("../Utils/helpers");

// Login OTP
const RequestAuthOtp = router.post(
  "/request-auth-otp",
  ...LoginValidator,
  ValidateRequestBody,
  async (req, res) => {
    try {
      const { phone, role } = req.body;
      const user = await OtpModel.findOne({ phone: phone, userRole: role });
      const otp = OTPgenerator();
      if (user) {
        user.otp = otp;
        const data = await user.save();
        res.send({
          code: 200,
          data: data,
        });
      } else {
        const newUser = new OtpModel({ phone: phone, otp, userRole: role });
        const data = await newUser.save();
        res.send({
          code: 200,
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.code == 11000) {
        return res.status(409).json({ error: "Please use different phone" });
      }
      res.send({
        code: 400,
        error: "error",
      });
    }
  }
);

// Verify OTP
const VerifyOtp = router.post(
  "/verify-otp",
  ...VerifyOtpValidator,
  ValidateRequestBody,
  async (req, res) => {
    try {
      const { phone, otp, role } = req.body;
      const otpAvail = await OtpModel.findOne({
        $and: [{ phone: phone }, { otp: otp }, { role: role }],
      });
      if (
        otpAvail &&
        role === "user" &&
        !otpAvail.isExpired(otpAvail.updated_at)
      ) {
        otpAvail.otp = null;
        await otpAvail.save();
        const user = await UsersModel.findOne({
          "phone.primary.number": phone,
        });

        if (!user) {
          const data = await UsersModel.create({
            "phone.primary.number": phone,
          });

          const payload = { id: data._id, userType: "user" };
          const access_token = generateJwtAccessToken(payload);
          const refresh_token = generateJwtRefreshToken(payload);

          await SessionModal.create({
            user: data._id,
            userType: "user",
            access_token,
            refresh_token,
            ExpireOn: moment(new Date()).add(
              parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION),
              "seconds"
            ),
          });

          const updatedUser = await UsersModel.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(data._id) },
            { isVerified: true },
            { new: true, upsert: true }
          );

          return sendUserResponse(res, updatedUser, {
            access_token,
            refresh_token,
          });
        } else {
          // check if user is blocked
          if (!user?.isActive) {
            return res.send({
              code: 403,
              error:
                "You are blocked to access this route. please contact Admin for further details.",
            });
          }

          const payload = { id: user._id, userType: "user" };
          const access_token = generateJwtAccessToken(payload);
          const refresh_token = generateJwtRefreshToken();

          await SessionModal.create({
            user: user._id,
            userType: "user",
            access_token,
            refresh_token,
            ExpireOn: moment(new Date())
              .add(parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION), "minute")
              .toISOString(),
          });

          return sendUserResponse(res, user, {
            access_token,
            refresh_token,
          });
        }
      } else {
        return res.send({
          code: 401,
          error: "Invalid OTP",
        });
      }
    } catch (error) {
      console.log(error);
      if (error.message) {
        return res.send({
          code: 400,
          error: error.message,
        });
      }
      res.send({
        code: 400,
        error: "error",
      });
    }
  }
);

// Complete User Profile
const CompleteUserProfile = router.post(
  "/complete-user-profile",
  UserAuthValidator,
  async (req, res) => {
    try {
      const user = await UsersModel.findOne({ _id: req.user });
      if (user && user.isVerified) {
        return res.status(400).json({ message: "Already Verified." });
      } else if (user && !user.isVerified) {
        let newObj = {
          ...req.body,
          isVerified: true,
        };
        const newUser = await UsersModel.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(req.user) },
          newObj,
          { new: true, upsert: true }
        );

        sendUserResponse(res, newUser);
      } else {
        throw new Error("You are not authorized to access this route");
      }
    } catch (error) {
      if (error.code == 11000) {
        return res.status(403).json({ error: "Email already exists" });
      } else if (error.message) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.sendStatus(400);
      }
    }
  }
);

// Admin Login
const AdminLogin = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const admin = await AdminModel.findOne(
      { userName: username, role },
      "userName password role"
    );
    if (!admin) {
      return res.send({
        code: 401,
        error: "You are not Authorized to access this route.",
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.send({
        code: 401,
        error: "You are not Authorized to access this route.",
      });
    }

    const payload = { id: admin._id, userType: "admin" };
    const access_token = generateJwtAccessToken(payload);

    const refresh_token = generateJwtRefreshToken();

    await SessionModal.create({
      user: admin._id,
      userType: "admin",
      access_token,
      refresh_token,
      ExpireOn: moment(new Date())
        .add(parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION), "minute")
        .toISOString(),
    });

    return res.send({
      code: 200,
      data: {
        id: admin._id,
        userName: admin.userName,
        userType: "admin",
        access_token,
        refresh_token,
      },
    });
  } catch (error) {
    res.send({
      code: 400,
      error: error.message,
    });
  }
};

// Session
const SessionUser = router.post("/session", async (req, res) => {
  const bearerToken = req.headers.authorization;
  const access_token = bearerToken?.split(" ")[1];
  // const { deviceRegistrationToken } = req.body;
  if (access_token) {
    try {
      const decoded = jwt.verify(
        access_token,
        process.env.JWT_ACCESS_TOKEN_SECRET
      );
      //usertype === user
      if (decoded && decoded.userType === "user") {
        const user = await UsersModel.findOne({ _id: decoded.id });
        if (user) {
          // updating user device token for firebase notifications
          // user.device = {
          //   mobile: {
          //     registrationToken: deviceRegistrationToken,
          //   },
          // };
          // await user.save();
          sendUserResponse(res, user);
        } else {
          res.send({
            code: 404,
            error: "Not Found",
          });
        }
      } else if (decoded && decoded.userType === "admin") {
        const admin = await AdminModel.findOne(
          { _id: decoded.id },
          "userName role"
        );
        if (!admin) {
          return res.send({
            code: 401,
            error: "You are not Authorized to access this route.",
          });
        }

        res.send({
          id: admin._id,
          userName: admin.userName,
          userType: admin.role,
        });
      } else {
        res.send({
          code: 403,
          error: "Wrong Attempt",
        });
      }
    } catch (error) {
      res.status(403).json({ error: "You are not authorized" });
    }
  } else {
    res.send({
      code: 401,
      error: "You are not authorized",
    });
  }
});

/**
 * @token
 */
const GetAccessToken = router.post("/access-token", async (req, res) => {
  const bearerToken = req.headers.authorization;
  const refresh_token = bearerToken?.split(" ")[1];
  if (!refresh_token) return res.sendStatus(401);
  try {
    jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) return sendErrorResponse(res, err);

        const session = await SessionModal.findOne({ refresh_token });
        if (!session) return res.sendStatus(403);

        const payload = { id: user.id, userType: session.userType };
        const access_token = generateJwtAccessToken(payload);

        // updating session
        session.access_token = access_token;
        await session.save();

        sendResponse(res, { access_token });
      }
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

module.exports = {
  RequestAuthOtp,
  VerifyOtp,
  CompleteUserProfile,
  AdminLogin,
  SessionUser,
  GetAccessToken,
};
