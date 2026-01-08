import {
  getAllInventory,
  updateInventoryItem,
} from "./wholesaler.inventory.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getInventory = async (req, res, next) => {
  try {
    const inventory = await getAllInventory(req.user.id);
    res.json(new ApiResponse(200, inventory));
  } catch (error) {
    next(error);
  }
};

export const updateInventory = async (req, res, next) => {
  try {
    const item = await updateInventoryItem(
      req.params.id,
      req.body,
      req.user.id
    );
    res.json(new ApiResponse(200, item));
  } catch (error) {
    next(error);
  }
};
