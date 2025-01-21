import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import EmailVerify from "../pages/EmailVerify";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import NoPageFound from "../pages/NoPageFound";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "email-verify", element: <EmailVerify /> },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "*", element: <NoPageFound /> },
]);

export default router;
