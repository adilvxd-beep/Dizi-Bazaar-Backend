import {
  findAllUsers,
  createUser,
  findUserByEmail,
} from "./admin.user.repository.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../../shared/utils/jwtToken.js";

export const getAllUsers = async () => {
  return await findAllUsers();
};

export const createNewUser = async (userData) => {
  return await createUser(userData);
};

export const loginUser = async (userData) => {
  const { email, password } = userData;
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid password");
  const token = generateToken({ id: user.id, role: user.role });
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
