import express from "express";
import userAuth from "../middleware/authUser.js";
import { singleUserData } from "../controller/user.controller.js";

const route = express.Router();

route.get("/getData", userAuth, singleUserData);

export default route;
