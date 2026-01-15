import { createWholesalerService, updateWholesalerDocumentsService } from './admin.wholesaler.service.js';
import ApiError from "../../../shared/utils/ApiError.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const createWholesalerController = async (req, res, next) => {
    console.log("✅ CONTROLLER HIT: createWholesalerController");

  try {
    const wholesaler = await createWholesalerService(
      req.body,
      req.user   // comes from auth middleware
    );

    return res.status(201).json({
      success: true,
      message: "Wholesaler created successfully",
      data: wholesaler
    });
  } catch (error) {
    next(error);
  }
};

export const updateWholesalerDocumentsController = async (
  req,
  res,
  next
) => {
  try {
    const { wholesalerId } = req.params;

    const documents = await updateWholesalerDocumentsService(
      wholesalerId,
      req.body   // dynamic document updates
    );

    return res.status(200).json({
      success: true,
      message: "Wholesaler documents updated successfully",
      data: documents
    });
  } catch (error) {
    next(error);
  }
};
