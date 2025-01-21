import path from "path";
import express from "express";
import { PORT } from "./config/env.js";
import MongoDb from "./config/mongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/auth.Routes.js";
import UserRoute from "./routes/user.Routes.js"

const app = express();

app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();


app.use(cors({
  origin:'http://localhost:5173',
  credentials: true }));

app.use(express.static(path.join(__dirname, "client/dist")));

app.use("/api/auth/", AuthRoutes);
app.use("/api/user/", UserRoute);


app.listen(PORT, () => {
  MongoDb();
  console.log("Server start at Port:", PORT);
});
