import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const inputRef = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const past = e.clipboardData.getData("text");
    const pastArray = past.split("");
    pastArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/send-reset-otp", { email });

      const dataResponse = response;
     

      if (dataResponse.data.success) {
        toast.success(dataResponse.data.message);
        setIsEmailSent(true);
      } else {
        toast.error(dataResponse.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((e) => e.value);
    setOtp(otpArray.join(""));

    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      const dataResponse = response;

      if (dataResponse.data.success) {
        toast.success(dataResponse.data.message);
        navigate("/login");
      } else {
        toast.error(dataResponse.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log("ResetPassword", error.message);
    }
  };
  return (
    <>
      <div className="flex items-center flex-col justify-center text-sm min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-purple-400">
        <Link
          to={-1}
          className="absolute top-5 left-10 text-2xl font-extrabold px-4 py-1 bg-red-200 hover:bg-red-300 transition-all hover:text-white rounded-full"
        >
          Back
        </Link>
        <Toaster position="right-top" />
        <div className="bg-slate-800 text-indigo-300 text-2xl p-2 rounded-lg shadow-lg w-full  sm:w-96">
          {/* send email submit */}
          {!isEmailSent && (
            <form
              onSubmit={onSubmitEmail}
              className="bg-slate-600 p-4 rounded-lg shadow-lg w-full text-sm"
            >
              <h1 className="text-white text-2xl font-semibold text-center mb-4">
                Reset Password
              </h1>
              <p className="text-center mb-6 text-indigo-300">
                Enter Your Registered email address.
              </p>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <input
                  type="email"
                  placeholder="Email id"
                  className="w-full bg-transparent outline-none text-slate-100 text-sm tracking-wider p-2  rounded-full   focus:bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button className="w-full py-3 mt-3 bg-gradient-to-r from bg-indigo-500 to-indigo-900 text-white rounded-full">
                Submit
              </button>
            </form>
          )}

          {/* Otp input form */}
          {!isOtpSubmited && isEmailSent && (
            <form
              onSubmit={onSubmitOTP}
              className="bg-slate-600 p-4 rounded-lg shadow-lg w-full text-sm"
            >
              <h1 className="text-white text-2xl font-semibold text-center mb-4">
                Password Verify OTP
              </h1>
              <p className="text-center mb-6 text-indigo-300">
                Enter the 6-digit code sent to your email id.{" "}
              </p>
              <div className="flex justify-between mb-4" onPaste={handlePaste}>
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <input
                      type="text"
                      maxLength={1}
                      key={index}
                      required
                      className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                      ref={(e) => (inputRef.current[index] = e)}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
              </div>
              <button className="w-full py-3 bg-gradient-to-r from bg-indigo-500 to-indigo-900 text-white rounded-full">
                Submit
              </button>
            </form>
          )}

          {/* enter new Password */}
          {isOtpSubmited && isEmailSent && (
            <form
              onSubmit={onSubmitNewPassword}
              className="bg-slate-600 p-4 rounded-lg shadow-lg w-full text-sm"
            >
              <h1 className="text-white text-2xl font-semibold text-center mb-4">
                Set New Password
              </h1>
              <p className="text-center mb-6 text-indigo-300">
                Enter Your Registered email address.
              </p>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <input
                  type="password"
                  placeholder="Enter New Password"
                  className="w-full bg-transparent outline-none text-slate-100 text-sm tracking-wider p-2  rounded-full   focus:bg-transparent"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button className="w-full py-3 mt-3 bg-gradient-to-r from bg-indigo-500 to-indigo-900 text-white rounded-full">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
