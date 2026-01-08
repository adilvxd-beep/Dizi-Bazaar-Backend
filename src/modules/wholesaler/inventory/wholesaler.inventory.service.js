import {
  findInventoryByUserId,
  updateInventoryItem as updateInventory,
} from "./wholesaler.inventory.repository.js";

export const getAllInventory = async (userId) => {
  return await findInventoryByUserId(userId);
};

export const updateInventoryItem = async (id, data, userId) => {
  const { quantity } = data;
  return await updateInventory(id, quantity, userId);
};
