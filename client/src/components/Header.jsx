import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";

const Header = () => {
  const [userName, setUserName] = useState();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  
  const fetchData = async () => {
    try {
     
      const response = await axios.get("api/user/getData");

      // Assuming the server responds with { success: true, userData: ..., ... }
      const dataResponse = response.data;

      if (dataResponse.success) {
        toast.success(`Welcome  ${dataResponse.userData.name}`);

        setUserName(dataResponse.userData.name);
        dispatch(setUser(dataResponse.userData));
      } else {
        toast.error(dataResponse.message || "Failed to fetch data.");
      }
    } catch (error) {
      // Error message from the server or fallback
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error: ${errorMessage}`);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
     
    } else {
      setUserName("");
    }
  }, [isLoggedIn]);

  return (
    <>
      <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800 text-3xl">
        <h1 className="flex items-center gap-2 text-xl font-medium mb-2 sm:text-3xl">
          Hey{" "}
          {userName ? (
            <span className="text-orange-500 font-extrabold tracking-widest">
              {userName}!
            </span>
          ) : (
            "Developer !"
          )}
        </h1>
        <h3 className="text-3xl sm:text-5xl font-semibold mb-4">
          Welcome to Our App
        </h3>
        <p className="mb-8 max-w-md">
          Let's start with a quick tour, and we will have you up and running in
          no time!
        </p>
        <button
          onClick={() => {
            toast.success("Hello Amit");
          }}
          className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-200 transition-all"
        >
          Get Started
        </button>
      </div>
    </>
  );
};

export default Header;
