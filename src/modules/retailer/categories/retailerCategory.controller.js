import { findAllCategoriesForRetailerService } from "./retailerCategory.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const findAllCategoriesForRetailerController = async (
  req,
  res,
  next
) => {
  try {
    const result = await findAllCategoriesForRetailerService();

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Categories fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};