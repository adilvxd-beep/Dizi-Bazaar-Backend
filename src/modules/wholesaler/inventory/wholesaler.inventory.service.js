import {
  findStockByUserId,
  findStockByVariantAndUser,
  upsertStockWithPricing,
  updateStockQuantity,
  updatePricing,
  deleteStockAndPricing,
  findLowStockByUserId,
  findOutOfStockByUserId,
  getStockSummary,
  findStockByProductAndUser,
} from "./wholesaler.inventory.repository.js";

export const getAllStock = async (userId) => {
  return await findStockByUserId(userId);
};

export const getStockByVariant = async (variantId, userId) => {
  return await findStockByVariantAndUser(variantId, userId);
};

export const saveStockWithPricing = async (data, userId) => {
  return await upsertStockWithPricing({
    ...data,
    userId,
  });
};

export const updateStock = async (variantId, quantity, userId) => {
  return await updateStockQuantity(variantId, userId, quantity);
};

export const updateVariantPricing = async (data, userId) => {
  return await updatePricing({
    ...data,
    userId,
  });
};

export const deleteStock = async (variantId, userId) => {
  return await deleteStockAndPricing(variantId, userId);
};

export const getLowStock = async (userId, threshold) => {
  return await findLowStockByUserId(userId, threshold);
};

export const getOutOfStock = async (userId) => {
  return await findOutOfStockByUserId(userId);
};

export const getStockSummaryService = async (userId) => {
  return await getStockSummary(userId);
};

export const getStockByProduct = async (productId, userId) => {
  return await findStockByProductAndUser(productId, userId);
};
