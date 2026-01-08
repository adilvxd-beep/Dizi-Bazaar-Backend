import { findAllUsers, createUser } from "./admin.user.repository.js";

export const getAllUsers = async () => {
  return await findAllUsers();
};

export const createNewUser = async (userData) => {
  return await createUser(userData);
};
