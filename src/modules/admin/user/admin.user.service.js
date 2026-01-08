import {
  findAllUsers,
  createUser,
  findUserByEmail,
} from "./admin.user.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "../../../config/index.js";

export const getAllUsers = async () => {
  return await findAllUsers();
};

export const createNewUser = async (userData) => {
  return await createUser(userData);
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid password");
  const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET);
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};
