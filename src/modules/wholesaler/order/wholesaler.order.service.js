import {
  findOrdersByUserId,
  createOrderForUser,
} from "./wholesaler.order.repository.js";

export const getAllOrders = async (userId) => {
  return await findOrdersByUserId(userId);
};

export const createNewOrder = async (orderData, userId) => {
  return await createOrderForUser(orderData, userId);
};
