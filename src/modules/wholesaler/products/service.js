import { findAllProducts } from "./repository.js";

export const getAllProducts = async (userId, query) => {
  return await findAllProducts(userId, query);
};
