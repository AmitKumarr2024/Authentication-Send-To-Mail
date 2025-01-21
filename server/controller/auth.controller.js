import UserModel from "../models/auth.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV, SENDER_EMAIL } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplate.js";

// signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: true, message: "Missing Credential" });
  }

  try {
    const userAlreadyExist = await UserModel.findOne({ email });
    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ error: true, message: "User Already Exist in Database." });
    }

    const hashPassword = await bcryptjs.hash(password, 9);
    const user = new UserModel({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "Production",
      sameSite: NODE_ENV === "Production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // send mail Option

    const mailOption = {
      from: SENDER_EMAIL,
      to: email,
      subject: "Welcome to Amit Ka Addaa aajao",
      text: `Welcome to Amit great Developer area.Your account is created successfully.Your email is ${email}`,
    };

    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP Connection Failed:", error);
      } else {
        console.log("SMTP Connected Successfully:", success);
      }
    });

    await transporter.sendMail(mailOption);

    res.status(200).json({
      success: true,
      message: "User Register Created Successfully",
      user: user,
    });
  } catch (error) {
    res
      .status(401)
      .json({ error: true, message: `SignUp Controller error:${error}` });
  }
};

// login

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(401)
      .json({ success: false, message: "Missing Input Please Fill" });
  }
  try {
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      return res
        .status(401)
        .json({ success: false, message: "User Not Exist" });
    }

    // now compare
    const passwordMatch = await bcryptjs.compare(password, userExist.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Password Not Match.Please try again to Login ",
      });
    }

    const token = jwt.sign({ id: userExist._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "Production",
      sameSite: NODE_ENV === "Production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfully Completed",
      user: token,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: NODE_ENV === "Production",
      sameSite: NODE_ENV === "Production" ? "none" : "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

// send verify Otp
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await UserModel.findById(userId);

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account is Already Verified" });
    }
    // create OTP

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 60 * 60 * 1000; //1-hour
    await user.save();

    //Send mail option

    const mailOption = {
      from: `Mount Amit <${SENDER_EMAIL}>`,
      to: user.email,
      subject: "Account Verification OTP",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOption);
    res
      .status(201)
      .json({ success: true, message: "Verification sent On Your Email." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// emailVerify
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.status(402).json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User Not Found." });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(401).json({ success: false, message: "OTP Expired" });
    }
    (user.isAccountVerified = true),
      (user.verifyOtpExpireAt = "0"),
      (user.verifyOtp = "");

    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "Email Verified successfully" });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const isUserAuthenticated = async (req, res) => {
  try {
    res.status(201).json({ success: true, message: "User is Authenticated." });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(401)
      .json({ success: false, message: "Email is required" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User Not Found." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    (user.resetOtp = otp),
      (user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000);

    await user.save();

    const mailOption = {
      from: `Mount Amit <${SENDER_EMAIL}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };
    await transporter.sendMail(mailOption);

    res.status(201).json({ success: true, message: "OTP sent to Your email" });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

// reset your password

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email,OTP,New Password are required",
    });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not Found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(401).json({ success: false, message: "OTP Expired" });
    }

    // new Password with hash

    const hashPassword = await bcryptjs.hash(newPassword, 10);

    (user.password = hashPassword),
      (user.resetOtp = ""),
      (user.resetOtpExpireAt = 0);

    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
