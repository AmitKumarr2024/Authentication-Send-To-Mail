import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast,{ Toaster } from "react-hot-toast";

import axios from "axios";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setUser } from "../redux/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;


    try {
      const endpoint =
        authMode === "signup" ? "api/auth/signup" : "api/auth/login";

      const payload =
        authMode === "signup" ? { name, email, password } : { email, password };

      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        dispatch(setUser(data.user));
        dispatch(setIsLoggedIn(true));
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="flex items-center flex-col justify-center text-sm min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-300 to-purple-400">
      <Link
        to="/"
        className="absolute top-5 left-10 text-2xl font-extrabold px-4 py-1 bg-red-200 hover:bg-red-300 transition-all hover:text-white rounded-full"
      >
        LOGO
      </Link>
      <Toaster position="right-top"/>
      

      <div className="bg-slate-900 text-indigo-300 text-2xl p-10 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="tracking-wide text-4xl font-semibold text-white text-center mb-3">
          {authMode === "signup" ? "Create Account" : "Login"}
        </h2>
        <p className="tracking-widest text-xs text-center mb-6">
          {authMode === "signup"
            ? "Create an Account"
            : "Login to Your Account"}
        </p>
        <form onSubmit={handleSubmit}>
          {authMode === "signup" && (
            <InputField
              name="name"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          )}
          <InputField
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <InputField
            name="password"
            type="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <Link
            to="/reset-password"
            className="mx-auto text-indigo-400 font-extrabold text-sm cursor-pointer"
          >
            Forgot password?
          </Link>
          <button className="w-full py-2 mt-4 rounded-full bg-slate-700 text-white font hover:bg-slate-600">
            {authMode === "signup" ? "Signup" : "Login"}
          </button>
        </form>
        <p className="text-gray-400 text-center text-sm font-bold mt-4">
          {authMode === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}
          <span
            onClick={() =>
              setAuthMode(authMode === "signup" ? "login" : "signup")
            }
            className="text-blue-400 font-extrabold cursor-pointer uppercase underline"
          >
            {authMode === "signup" ? " Login" : " Signup"}
          </span>
        </p>
      </div>
    </div>
  );
};

const InputField = ({ name, type = "text", placeholder, value, onChange }) => (
  <div className="mb-4 flex items-center gap-3 w-full px-4 py-3 rounded-full  bg-[#333A5C]">
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full bg-transparent outline-none text-slate-100 text-sm tracking-wider p-2 focus:ring-2 rounded-full  focus:ring-blue-400 focus:bg-transparent"
    />
  </div>

);

export default Login;
