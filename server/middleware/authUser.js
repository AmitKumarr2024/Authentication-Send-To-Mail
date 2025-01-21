import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Login Again",
    });
  }

  try {
    const tokenDecoded = jwt.verify(token, JWT_SECRET);

    if (tokenDecoded.id) {
      req.body.userId = tokenDecoded.id;
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Login Again" });
    }
    next();
  } catch (error) {
    res
      .status(402)
      .json({ success: false, message: `user auth ${error.message}` });
  }
};

export default userAuth;
