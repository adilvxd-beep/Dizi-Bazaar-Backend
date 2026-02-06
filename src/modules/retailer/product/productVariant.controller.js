import { findAllProductVariantsForRetailerService, findProductWithVariantsForRetailerByIdService } from "./productVariant.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const findAllProductVariantsForRetailerController = async (
  req,
  res,
  next
) => {
  try {

    const result = await findAllProductVariantsForRetailerService(req.query);

    return res.status(200).json(
      new ApiResponse(200, result, "Product variants fetched successfully")
    );
  } catch (error) {
    next(error);
  }
};

export const findProductWithVariantsForRetailerController = async (
  req,
  res,
  next
) => {
  try {
    const { productId } = req.params;

    const result =
      await findProductWithVariantsForRetailerByIdService(productId);

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Product details fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

