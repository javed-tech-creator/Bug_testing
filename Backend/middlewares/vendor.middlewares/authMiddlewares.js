// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import User from "../../modules/HR/models/masters/user.model.js";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  // console.log("req.cookies",req.cookies);
  
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  // console.log("req.token",token);

    if (!token) return res.status(401).json({ message: "No token found"});

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) return res.status(401).json({ message: "User not found with test ID" });
// console.log("user.type",user.type);

      // 2. Check type === VENDOR
    // if (user.type !== "VENDOR") {
    //   return res.status(403).json({
    //     message: "Login failed! Only VENDOR users are allowed to login.",
    //   });
    // }

    req.user = user;
    req.userProfileId = user.profile?._id.toString() || user.profile.toString();
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error:error.message });
  }
};

export default  authMiddleware;
