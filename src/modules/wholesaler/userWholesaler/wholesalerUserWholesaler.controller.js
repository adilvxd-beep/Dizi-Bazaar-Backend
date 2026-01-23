import { createWholesalerService, createWholesalerDocumentsService, } from "./wholesalerUserWholesaler.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const createWholesalerController = async (req, res, next) => {
  try {
    // console.log("👉 CONTROLLER HIT");
    // console.log("👉 req.user:", req.user);
    // console.log("👉 req.body:", req.body);

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
    const { wholesalerId } = req.params;

    const result = await createWholesalerDocumentsService(
      {
        ...req.body,
        wholesalerId: Number(wholesalerId)
      },
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
