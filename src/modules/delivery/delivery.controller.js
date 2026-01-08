import { getAllDeliveries, updateDeliveryStatus } from "./delivery.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";

export const getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await getAllDeliveries();
    res.json(new ApiResponse(200, deliveries));
  } catch (error) {
    next(error);
  }
};

export const updateDelivery = async (req, res, next) => {
  try {
    const delivery = await updateDeliveryStatus(req.params.id, req.body);
    res.json(new ApiResponse(200, delivery));
  } catch (error) {
    next(error);
  }
};
