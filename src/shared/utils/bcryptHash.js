import bcrypt from "bcrypt";
import { env } from "../../config/index.js";

const SALT_ROUNDS = parseInt(env.BCRYPT_SALT_ROUNDS) || 10;

export const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required for hashing");
  }
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }
  return await bcrypt.compare(plainPassword, hashedPassword);
};
