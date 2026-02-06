import {
  createWholesalerBasicService,
  getWholesalerByIdService,
  findAllWholesalersService,
  createWholesalerDocumentsService,
  updateWholesalerStatusService,
  updateWholesalerDocumentStatusService,
  updateWholesalerAndDocumentsService,
  deleteWholesalerByIdService,
  editWholesalerBasicAndDocumentsService,
  createWholesalerBankDetailsService,
  getAllUsersBankDetailsService,
  updateUserBankDetailsService,
  deleteWholesalerBankDetailsService,
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

//get wholesaler by id controller
export const getWholesalerByIdController = async (req, res, next) => {
  console.log("CONTROLLER HIT: getWholesalerByIdController");

  try {
    const { wholesalerId } = req.params;

    const result = await getWholesalerByIdService(wholesalerId);

    return res.status(200).json(    

      new ApiResponse(
        200,
        result,
        "Wholesaler details fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};    

export const findAllWholesalersController = async (req, res, next) => {
  console.log("CONTROLLER HIT: findAllWholesalersController");

  try {
    const result = await findAllWholesalersService(req.query);

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Wholesalers fetched successfully"
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

//bulk change controller
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

//delete wholesaler by id controller
export const deleteWholesalerByIdController = async (req, res, next) => {
  console.log("CONTROLLER HIT: deleteWholesalerByIdController");

  try {
    const { wholesalerId } = req.params;

    await deleteWholesalerByIdService(wholesalerId);

    return res.status(200).json(
      new ApiResponse(200, null, "Wholesaler deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};  


// edit wholesaler basic + documents controller
export const editWholesalerBasicAndDocumentsController = async (
  req,
  res,
  next
) => {
  console.log(
    "CONTROLLER HIT: editWholesalerBasicAndDocumentsController"
  );

  try {
    const { wholesalerId } = req.params;

    const result = await editWholesalerBasicAndDocumentsService(
      wholesalerId,
      req.body,
      req.user // admin
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Wholesaler details updated successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};


export const createWholesalerBankDetailsController = async (
  req,
  res,
  next
) => {
  console.log("CONTROLLER HIT: createWholesalerBankDetailsController");

  try {
    const { userId } = req.params;

    const result = await createWholesalerBankDetailsService(
      userId,
      req.body
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "Wholesaler bank details added successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getAllUsersBankDetailsController = async (
  req,
  res,
  next
) => {
  try {
    const result = await getAllUsersBankDetailsService();

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "All users bank details fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const updateUserBankDetailsController = async (
  req,
  res,
  next
) => {
  console.log("CONTROLLER HIT: updateUserBankDetailsController");

  try {
    const userId = Number(req.params.userId);

    // validate userId
    if (Number.isNaN(userId)) {
      return res.status(400).json(
        new ApiResponse(
          400,
          null,
          "Invalid userId"
        )
      );
    }

    const result = await updateUserBankDetailsService(
      userId,
      req.body,
      req.user // admin user from auth middleware
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        "User bank details updated successfully"
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
  try {
    const { userId } = req.params;

    const result = await deleteWholesalerBankDetailsService(userId);

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
