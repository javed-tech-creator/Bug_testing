import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import saleRegistrationModel from "../models/registration/registration.model.js";

/**
 * Middleware to check if user is a Manager
 */
export const isManager = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new AppError("Unauthorized: No token provided", 401));
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded || !decoded.id) {
      return next(new AppError("Invalid token", 401));
    }

    // Fetch user details
    const user = await saleRegistrationModel
      .findById(decoded.id)
      .select("role");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Check if user role is Manager
    if (user.role !== "Manager" && user.role !== "manager") {
      return next(
        new AppError(
          "Access denied: Only managers can access this resource",
          403
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Authentication failed", 401));
  }
};

/**
 * Middleware to check if user is an Executive
 */
export const isExecutive = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new AppError("Unauthorized: No token provided", 401));
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded || !decoded.id) {
      return next(new AppError("Invalid token", 401));
    }

    // Fetch user details
    const user = await saleRegistrationModel
      .findById(decoded.id)
      .select("role");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Check if user role is Executive
    if (user.role !== "Executive" && user.role !== "executive") {
      return next(
        new AppError(
          "Access denied: Only executives can access this resource",
          403
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Authentication failed", 401));
  }
};

/**
 * Middleware to check if user is either Manager or Executive
 */
export const isManagerOrExecutive = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new AppError("Unauthorized: No token provided", 401));
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded || !decoded.id) {
      return next(new AppError("Invalid token", 401));
    }

    // Fetch user details
    const user = await saleRegistrationModel
      .findById(decoded.id)
      .select("role");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Check if user role is Manager or Executive
    const allowedRoles = ["Manager", "manager", "Executive", "executive"];
    if (!allowedRoles.includes(user.role)) {
      return next(
        new AppError(
          "Access denied: Only managers or executives can access this resource",
          403
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Authentication failed", 401));
  }
};

/**
 * Middleware to check user role dynamically
 * @param {Array} roles - Array of allowed roles
 */
export const checkRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token =
        req.cookies?.token || req.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new AppError("Unauthorized: No token provided", 401));
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!decoded || !decoded.id) {
        return next(new AppError("Invalid token", 401));
      }

      // Fetch user details
      const user = await saleRegistrationModel
        .findById(decoded.id)
        .select("role");

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Convert roles to lowercase for case-insensitive comparison
      const normalizedRoles = roles.map((role) => role.toLowerCase());
      const userRole = user.role.toLowerCase();

      if (!normalizedRoles.includes(userRole)) {
        return next(
          new AppError(
            `Access denied: Only ${roles.join(", ")} can access this resource`,
            403
          )
        );
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new AppError("Authentication failed", 401));
    }
  };
};
