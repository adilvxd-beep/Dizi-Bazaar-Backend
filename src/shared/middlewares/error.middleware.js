import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  logger.error(err.message);

  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ApiError(404, message);
  }

  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ApiError(400, message);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};
