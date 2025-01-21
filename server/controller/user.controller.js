import UserModel from "../models/auth.models.js";

export const singleUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await UserModel.findById(userId);

    if (!userData) {
      res.status(401).json({ success: false, message: "User not Found" });
    }

    res.status(201).json({
      success: true,
      userData: {
        name: userData.name,
        isAccountVerified: userData.isAccountVerified,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
