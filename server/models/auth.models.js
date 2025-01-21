import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, Required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: String, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
});

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
