import * as service from "./wholesaler.order.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getBroadcasts = async (req, res, next) => {
  try {
    const broadcasts = await service.getPendingBroadcasts(req.user.id);
    res.json(new ApiResponse(200, broadcasts));
  } catch (error) {
    next(error);
  }
};

export const acceptOrder = async (req, res, next) => {
  try {
    const { orderId, itemIds } = req.body;
    if (!orderId || !itemIds || !Array.isArray(itemIds)) {
      throw new Error("Invalid payload: orderId and itemIds (array) are required.");
    }
    
    const acceptedItems = await service.acceptBroadcastItems(req.user.id, orderId, itemIds);
    res.json(new ApiResponse(200, acceptedItems, "Items accepted successfully. Inventory updated if managed."));
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await service.getFulfilledOrders(req.user.id);
    res.json(new ApiResponse(200, orders));
  } catch (error) {
    next(error);
  }
};
