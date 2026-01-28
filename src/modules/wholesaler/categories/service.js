import { findAllCategories } from "./repository.js";

export const getAllCategories = async (userId, query) => {
  return await findAllCategories(userId, query);
};
