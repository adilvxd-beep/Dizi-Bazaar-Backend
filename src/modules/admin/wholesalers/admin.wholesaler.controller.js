import {
  createWholesalerBasicService,
  createWholesalerDocumentsService,
  updateWholesalerStatusService,
  updateWholesalerDocumentStatusService,
  updateWholesalerAndDocumentsService,
} from "./admin.wholesaler.service.js";

import ApiResponse from "../../../shared/utils/ApiResponse.js";


// create wholesaler basic controller
export const createWholesalerController = async (req, res, next) => {
  console.log("CONTROLLER HIT: createWholesalerController");

  try {
    const result = await createWholesalerBasicService(
      req.body,
      req.user
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "Wholesaler basic details created successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

//create wholesaler documents controller
export const createWholesalerDocumentsController = async (
  req,
  res,
  next
) => {
  console.log("CONTROLLER HIT: createWholesalerDocumentsController");

  try {
    const { wholesalerId } = req.params;

    const result = await createWholesalerDocumentsService(
      wholesalerId,
      req.body
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "Wholesaler documents uploaded successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

// update wholesaler status controller
export const updateWholesalerStatusOnlyController = async (req, res, next) => {
  try {
    const { wholesalerId } = req.params;
    const { status } = req.body;

    const result = await updateWholesalerStatusService(
      wholesalerId,
      status
    );

    return res.status(200).json(
      new ApiResponse(200, result, "Wholesaler status updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// update wholesaler documents status controller
export const updateWholesalerDocumentsStatusController = async (
  req,
  res,
  next
) => {
  try {
    const { wholesalerId } = req.params;

    const result = await updateWholesalerDocumentStatusService(
      wholesalerId,
      req.body
    );

    return res.status(200).json(
      new ApiResponse(200, result, "Document status updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

export const verifyWholesalerController = async (req, res, next) => {
  console.log("CONTROLLER HIT: verifyWholesalerController");

  try {
    // Always coerce to number to avoid NaN issues
    const wholesalerId = Number(req.params.wholesalerId);

    console.log("PARAM:", req.params);
    console.log("WHOLESALER ID:", wholesalerId);

    const result = await updateWholesalerAndDocumentsService(
      wholesalerId,
      req.body,
      req.user
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Wholesaler verification completed successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

