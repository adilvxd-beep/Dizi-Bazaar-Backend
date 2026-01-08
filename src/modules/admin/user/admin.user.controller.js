import { getAllUsers, createNewUser, loginUser } from "./admin.user.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import ApiError from "../../../shared/utils/ApiError.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(new ApiResponse(200, users));
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await createNewUser(req.body);
    res.status(201).json(new ApiResponse(201, user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(new ApiResponse(200, result));
  } catch (error) {
    next(new ApiError(401, error.message));
  }
};
