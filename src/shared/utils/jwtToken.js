import jwt from "jsonwebtoken";
import { env } from "../../config/index.js";

export const generateToken = (payload, options = {}) => {
  const defaultOptions = {
    expiresIn: env.JWT_EXPIRES_IN || "7d",
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    ...defaultOptions,
    ...options,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const generateRefreshToken = (payload) => {
  return generateToken(payload, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  });
};
export const verifyRefreshToken = (token) => {
  return verifyToken(token);
};
