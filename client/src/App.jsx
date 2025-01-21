import React from "react";
import { Outlet } from "react-router-dom";
import  { Toaster } from 'react-hot-toast';

import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Toaster/>
      <Outlet/>
    </>
  );
};

export default App;
