import express from "express";
import {
  isUserAuthenticated,
  login,
  logout,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  signup,
  verifyEmail,
} from "../controller/auth.controller.js";
import userAuth from "../middleware/authUser.js";

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);
route.post("/logout", logout);
route.post("/send-verify-otp", userAuth, sendVerifyOtp);
route.post("/verify-email", userAuth, verifyEmail);
route.get("/is-auth", userAuth, isUserAuthenticated);
route.post("/send-reset-otp", sendResetOtp);
route.post("/reset-password", resetPassword);

export default route;
