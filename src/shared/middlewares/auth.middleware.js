import { verifyToken } from "../utils/jwtToken.js";
import ApiError from "../utils/ApiError.js";

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return next(new ApiError(401, "Access denied. No token provided."));
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid token."));
  }
};
