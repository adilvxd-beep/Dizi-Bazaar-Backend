import { z } from "zod";
import ApiError from "../utils/ApiError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(new ApiError(400, error.message));
    }
  };
};
