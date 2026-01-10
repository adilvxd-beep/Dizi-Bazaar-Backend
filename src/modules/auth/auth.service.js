import { createUser, findUserByPhone } from "./auth.repository.js";
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
