import { registerUser, loginUser, userSignupService } from "./auth.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import ApiError from "../../shared/utils/ApiError.js";

export const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await registerUser(userData);
    res.json(new ApiResponse(200, newUser));
  } catch (error) {
    next(new ApiError(500, error.message));
  }
};
export const login = async (req, res, next) => {
  try {
    const userData = req.body;
    const loginResult = await loginUser(userData);
    res.json(new ApiResponse(200, loginResult));
  } catch (error) {
    next(new ApiError(500, error.message));
  }
};

export const userSignupController = async (req, res, next) => {
  try {
    const result = await userSignupService(req.body);

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "User signup initiated successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};