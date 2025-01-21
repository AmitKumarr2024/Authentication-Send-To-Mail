import axios from "axios";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const inputRef = React.useRef([]);
  const navigate = useNavigate();
  const getUserData = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join("");

      const response = await axios.post("api/auth/verify-email", { otp });

      const dataResponse = response;
      

      if (dataResponse.data.success) {
        getUserData;
        navigate("/");
        toast.success(dataResponse.data.message);
      } else {
        toast.error(dataResponse.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    if(isLoggedIn){
      getUserData && navigate("/");

    }else{
      navigate('/login')
    }
  }, [isLoggedIn]);
  return (
    <>
      <div className=" w-screen flex items-center flex-col justify-center text-sm min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-purple-400">
        <div className="bg-slate-800 text-indigo-300 text-2xl p-2 rounded-lg shadow-lg w-full  sm:w-96">
          <form
            onSubmit={onSubmitHandler}
            className="bg-slate-600 p-4 rounded-lg shadow-lg w-full text-sm"
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Email Verify OTP
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
                    required
                    className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                    ref={(e) => (inputRef.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>
            <button className="w-full py-3 bg-gradient-to-r from bg-indigo-500 to-indigo-900 text-white rounded-full">
              Verify email
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmailVerify;
