import { findAllProducts, findProductWithVariantsById } from "./repository.js";

export const getAllProducts = async (userId, query) => {
  return await findAllProducts(userId, query);
};

export const getProductWithVariantsById = async (userId, productId) => {
  return await findProductWithVariantsById(userId, productId);
};
