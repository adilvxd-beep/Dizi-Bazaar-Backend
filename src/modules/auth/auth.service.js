import { createUser, findUserByPhone, signupWholesalerLite } from "./auth.repository.js";
import jwt from "jsonwebtoken";
import { env } from "../../config/index.js";

export const registerUser = async (userData) => {
  const { username, phone, role } = userData;
  const newUser = await createUser({
    username,
    phone,
    role,
  });
  return newUser;
};

export const loginUser = async (userData) => {
  const { phone } = userData;
  const user = await findUserByPhone(phone);
  if (!user) throw new Error("User not found");
  const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET);
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      phone: user.phone,
      role: user.role,
    },
  };
};

export const signupWholesalerLiteService = async (data) => {
  try {
    return await signupWholesalerLite(data);
  } catch (error) {

    if (error.message === "USER_ALREADY_EXISTS") {
      error.statusCode = 409;
      throw error;
    }

    if (error.code === "23503") {
      const err = new Error("INVALID_BUSINESS_CATEGORY");
      err.statusCode = 400;
      throw err;
    }

    throw error;
  }
};
