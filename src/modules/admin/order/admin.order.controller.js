import { getAllOrders, createNewOrder } from "./admin.order.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.json(new ApiResponse(200, orders));
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const order = await createNewOrder(req.body);
    res.status(201).json(new ApiResponse(201, order));
  } catch (error) {
    next(error);
  }
};
