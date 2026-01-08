import { getAllOrders, createNewOrder } from "./wholesaler.order.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrders(req.user.id);
    res.json(new ApiResponse(200, orders));
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const order = await createNewOrder(req.body, req.user.id);
    res.status(201).json(new ApiResponse(201, order));
  } catch (error) {
    next(error);
  }
};
