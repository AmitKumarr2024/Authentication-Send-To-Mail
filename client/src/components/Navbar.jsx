import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  logout,
  setIsLoggedIn,
  setUser,
  setUserAuth,
} from "../redux/userSlice";

const Navbar = () => {
  const [auth, setAuth] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  

  const fetchUser = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get("api/auth/is-auth");
      const dataResponse = response.data;

      if (dataResponse.success) {
        setAuth(dataResponse.success);
        dispatch(setUserAuth(dataResponse.success));
       
      } else if (dataResponse.error) {
        toast.error(dataResponse.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logoutFetchUser = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post("api/auth/logout");
      const dataResponse = await response.data;

      if (dataResponse.success) {
        toast.success("Successfully Logout");
        dispatch(setIsLoggedIn(dataResponse.success));
        dispatch(setUser(null));
        setAuth();
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Logout Error:", error);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      const response = await axios.post("api/auth/send-verify-otp");

      const dataResponse = response;

      if (dataResponse.data.success) {
        navigate("/email-verify");
        toast.success(dataResponse.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchUser(); // Call API if user is not set
  }, []); //

  return (
    <div className="navbar-font p-2 sm:p-4 sm:px-24 absolute top-0 flex items-center justify-between w-full border-b-2 shadow-2xl">
      <Link
        to="/"
        className="w-28 font-extrabold text-slate-500 text-2xl uppercase"
      >
        LOGO
      </Link>
      <div>
        {auth ? (
          <div
            className="hover:bg-red-500 cursor-pointer transition-all h-8 w-8 flex items-center justify-center border-2 border-black rounded-full relative group"
            title={user?.name}
          >
            {user?.name?.[0]?.toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                {!user?.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="py-1 px-8 hover:bg-gray-200 cursor-pointer"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={logoutFetchUser}
                  className="text-center py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="font-semibold flex items-center gap-2 border border-gray-700 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-200 hover:text-slate-600 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
