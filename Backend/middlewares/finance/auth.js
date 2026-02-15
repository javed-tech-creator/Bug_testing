// import jwt from "jsonwebtoken";
// import User from "../../models/finance/User.js";

// const authMiddleware = async (req, res, next) => {
//   const auth = req.headers.authorization;

//   if (!auth || !auth.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token" });
//   }

//   try {
//     const token = auth.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);

//     req.user = await User.findById(decoded.id).select("-password");
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Token invalid" });
//   }
// };

// export default authMiddleware;
// // 