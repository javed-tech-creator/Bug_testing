import jwt from "jsonwebtoken";
import User from "../../modules/HR/models/masters/user.model.js";
import ApiError from "../../utils/master/ApiError.js";

// Middleware factory: pass required permissions
export const authWithPermissions = (requiredPermissions = []) => {
  return async (req, res, next) => {
    console.log("Auth Middleware Invoked");
    try {
      
      const token =
         req.headers.authorization?.split(" ")[1] ||
        req.cookies?.accessToken || req.cookie || req.headers?.cookie;

      if (!token) return next(new ApiError(401, "Access token missing"));

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // 3. Fetch user
      const user = await User.findById(decoded._id)
        .populate("branch department designation zone state city actionGroups");

      if (!user) return next(new ApiError(404, "User not found"));
      if (user.status !== "Active")
        return next(new ApiError(403, "User is not active"));

      req.user = user;

      // 4. Check permissions if any required
      if (requiredPermissions.length) {
        const perms = await User.getPermissions(user._id);

        const allUserPerms = [
          ...perms.crud,
          ...perms.workflow,
          ...perms.data,
          ...perms.system,
        ];

        const hasPermission = requiredPermissions.every((p) =>
          allUserPerms.includes(p)
        );

        if (!hasPermission)
          return next(new ApiError(403, "Insufficient permissions"));
      }

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(401, "Access token expired"));
      }
      return next(new ApiError(401, "Invalid access token"));
    }
  };
};
