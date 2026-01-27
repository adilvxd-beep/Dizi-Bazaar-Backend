import { z } from "zod";
import ApiError from "../utils/ApiError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues.map((issue) => issue.message).join(", ");
        return next(new ApiError(400, message));
      }
      next(new ApiError(500, error.message || "Internal Server Error"));
    }
  };
};
