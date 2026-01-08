import { findAllOrders, createOrder } from "./admin.order.repository.js";

export const getAllOrders = async () => {
  return await findAllOrders();
};

export const createNewOrder = async (orderData) => {
  return await createOrder(orderData);
};
