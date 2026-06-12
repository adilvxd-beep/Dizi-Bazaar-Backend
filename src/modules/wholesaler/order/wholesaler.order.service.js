import {
  findBroadcastedOrders,
  acceptOrderItems,
  findOrdersByWholesalerId
} from "./wholesaler.order.repository.js";

export const getPendingBroadcasts = async (wholesalerId) => {
  return await findBroadcastedOrders(wholesalerId);
};

export const acceptBroadcastItems = async (wholesalerId, orderId, itemIds) => {
  return await acceptOrderItems(wholesalerId, orderId, itemIds);
};

export const getFulfilledOrders = async (wholesalerId) => {
  return await findOrdersByWholesalerId(wholesalerId);
};
