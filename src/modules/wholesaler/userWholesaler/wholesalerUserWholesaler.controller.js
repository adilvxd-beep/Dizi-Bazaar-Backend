import { 
  createWholesalerService, 
  createWholesalerDocumentsService, 
  updateWholesalerService, 
  createWholesalerBankDetailsService, 
  getWholesalerBankDetailsService,
  updateWholesalerBankDetailsService,
  deleteWholesalerBankDetailsService,
} from "./wholesalerUserWholesaler.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const createWholesalerController = async (req, res, next) => {
  try {
    const result = await createWholesalerService(req.body, req.user);

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "Wholesaler profile created successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};


export const createWholesalerDocumentsController = async (req, res, next) => {
  try {
    const result = await createWholesalerDocumentsService(
      req.body,
      req.user
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "Wholesaler documents submitted successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};


export const updateWholesalerController = async (req, res, next) => {
  try {
    const result = await updateWholesalerService(req.body, req.user);

    res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Wholesaler updated successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const createWholesalerBankDetailsController = async (req, res, next) => {
  try {
    const result = await createWholesalerBankDetailsService(
      req.body,
      req.user
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "Wholesaler bank details created successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getWholesalerBankDetailsController = async (req, res, next) => {
  try {
    const result = await getWholesalerBankDetailsService(req.user);

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Wholesaler bank details fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const updateWholesalerBankDetailsController = async (
  req,
  res,
  next
) => {
  console.log("CONTROLLER HIT: updateWholesalerBankDetailsController");

  try {
    const result = await updateWholesalerBankDetailsService(
      req.body,
      req.user   // wholesaler user from auth token
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Wholesaler bank details updated successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const deleteWholesalerBankDetailsController = async (
  req,
  res,
  next
) => {
  console.log("CONTROLLER HIT: deleteWholesalerBankDetailsController");

  try {
    const result = await deleteWholesalerBankDetailsService(req.user);

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Wholesaler bank details deleted successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
