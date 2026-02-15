export const errorHandler = (error, req, res, next) => {
  console.error("Error:", error);

  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong";

  // Mongo duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    message = `${field} must be unique. '${error.keyValue[field]}' already exists.`;
    statusCode = 400;
  }

  // Validation errors (Mongoose)
  else if (error.name === "ValidationError") {
    const firsterroror = Object.values(error.errors)[0].message;
    message = firsterroror;
    statusCode = 400;
  }

  // Invalid ObjectId
  else if (error.name === "CastError") {
    message = `Invalid ${error.path}: ${error.value}`;
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
