// utils/pagination.js

import ApiError from "./master/ApiError.js";


export const getPaginationParams = (req, next) => {
  let { page, limit } = req.query;

  // Default if missing
  if (page === undefined) page = 1;
  if (limit === undefined) limit = 10;

  // Invalid string cases
  if (page === "null" || page === "undefined") {
    throw new ApiError(400, "Page cannot be null or undefined");
  }
  if (limit === "null" || limit === "undefined") {
    throw new ApiError(400, "Limit cannot be null or undefined");
  }

  // Convert to number
  page = Number(page);
  limit = Number(limit);

  // Validation
  if (isNaN(page) || page <= 0) {
    throw new ApiError(400, "Page must be a positive number");
  }
  if (isNaN(limit) || limit <= 0) {
    throw new ApiError(400, "Limit must be a positive number");
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
