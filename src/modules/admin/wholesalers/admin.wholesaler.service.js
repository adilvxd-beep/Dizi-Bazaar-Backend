import {
  createWholesalerBasic,
  getWholesalerById,
  findAllWholesalers,
  createWholesalerDocuments,
  getWholesalerDocumentsByWholesalerId,
  updateWholesalerStatus,
  updateWholesalerDocumentStatus,
  updateWholesalerAndDocuments,
  deleteWholesalerById,
  editWholesalerBasicAndDocuments,
  createWholesalerBankDetails,
  getWholesalerBankDetailsByUserId,
  getAllUsersBankDetails,
  updateUserBankDetails,
  deleteWholesalerBankDetailsByUserId,
  updateWholesalerBasic,
  updateWholesalerDocuments,
} from "./admin.wholesaler.repository.js";

//CREATE WHOLESALER BASIC (USER + BUSINESS)
export const createWholesalerBasicService = async (data, adminUser) => {
  try {
    return await createWholesalerBasic(data, adminUser);
  } catch (error) {
    if (error.code === "23505") {
      const err = new Error("DUPLICATE_WHOLESALER");
      err.code = "DUPLICATE_WHOLESALER";
      err.statusCode = 409;
      throw err;
    }

    if (error.code === "23503") {
      const err = new Error("INVALID_REFERENCE");
      err.code = "INVALID_REFERENCE";
      err.statusCode = 400;
      throw err;
    }

    if (error.code === "23502") {
      const err = new Error("MISSING_REQUIRED_FIELD");
      err.code = "MISSING_REQUIRED_FIELD";
      err.statusCode = 400;
      throw err;
    }

    throw error;
  }
};

// UPDATE WHOLESALER BASIC (BUSINESS + USER)
export const updateWholesalerBasicService = async (
  wholesalerId,
  data,
  adminUser,
) => {
  try {
    return await updateWholesalerBasic(wholesalerId, data, adminUser);
  } catch (error) {
    // Wholesaler not found
    if (error.message === "WHOLESALER_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    // Foreign key violation
    if (error.code === "23503") {
      const err = new Error("INVALID_REFERENCE");
      err.statusCode = 400;
      throw err;
    }

    // Not-null constraint violation
    if (error.code === "23502") {
      const err = new Error("MISSING_REQUIRED_FIELD");
      err.statusCode = 400;
      throw err;
    }

    throw error;
  }
};

//get WHOLESALER BY ID SERVICE
export const getWholesalerByIdService = async (wholesalerId) => {
  try {
    return await getWholesalerById(wholesalerId);
  } catch (error) {
    if (error.message === "WHOLESALER_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }
    throw error;
  }
};

//get ALL WHOLESALERS SERVICE
export const findAllWholesalersService = async (query) => {
  try {
    return await findAllWholesalers(query);
  } catch (error) {
    // invalid number / pagination errors
    if (error.code === "22P02") {
      const err = new Error("INVALID_QUERY_PARAMS");
      err.statusCode = 400;
      throw err;
    }

    throw error; // unknown errors bubble to global handler
  }
};

//CREATE WHOLESALER DOCUMENTS
export const createWholesalerDocumentsService = async (
  wholesalerId,
  documents,
) => {
  try {
    return await createWholesalerDocuments(wholesalerId, documents);
  } catch (error) {
    if (error.message === "WHOLESALER_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    if (error.code === "23505") {
      const err = new Error("DOCUMENTS_ALREADY_EXIST");
      err.statusCode = 409;
      throw err;
    }

    if (error.code === "23502") {
      const err = new Error("MISSING_DOCUMENT_FIELD");
      err.statusCode = 400;
      throw err;
    }

    throw error;
  }
};

// UPDATE WHOLESALER DOCUMENTS (URL UPDATE)
export const updateWholesalerDocumentsService = async (
  wholesalerId,
  documents,
) => {
  try {
    return await updateWholesalerDocuments(wholesalerId, documents);
  } catch (error) {
    if (error.message === "WHOLESALER_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    if (error.message === "DOCUMENTS_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    if (error.code === "23502") {
      const err = new Error("MISSING_DOCUMENT_FIELD");
      err.statusCode = 400;
      throw err;
    }

    throw error;
  }
};

export const getWholesalerDocumentsByWholesalerIdService = async (
  wholesalerId,
) => {
  try {
    return await getWholesalerDocumentsByWholesalerId(wholesalerId);
  } catch (error) {
    if (error.message === "WHOLESALER_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    if (error.message === "DOCUMENTS_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    throw error;
  }
};

//Update wholesaler status

export const updateWholesalerStatusService = async (wholesalerId, status) => {
  try {
    const result = await updateWholesalerStatus(wholesalerId, status);

    return {
      success: true,
      message:
        status === "verified"
          ? "Wholesaler verified successfully"
          : "Wholesaler status updated successfully",
      data: result,
    };
  } catch (error) {
    if (error.message === "Wholesaler not found") {
      const err = new Error("WHOLESALER_NOT_FOUND");
      err.statusCode = 404;
      throw err;
    }

    const err = new Error("FAILED_TO_UPDATE_STATUS");
    err.statusCode = 500;
    throw err;
  }
};

// update wholesaler documents status
export const updateWholesalerDocumentStatusService = async (
  wholesalerId,
  updates,
) => {
  try {
    return await updateWholesalerDocumentStatus(wholesalerId, updates);
  } catch (error) {
    if (error.message === "DOCUMENTS_NOT_FOUND") {
      const err = new Error("DOCUMENTS_NOT_FOUND");
      err.statusCode = 404;
      throw err;
    }

    const err = new Error("FAILED_TO_UPDATE_DOCUMENT_STATUS");
    err.statusCode = 500;
    throw err;
  }
};

//bulk status change
export const updateWholesalerAndDocumentsService = async (
  wholesalerId,
  updateData,
  adminUser,
) => {
  try {
    return await updateWholesalerAndDocuments(
      wholesalerId,
      updateData,
      adminUser,
    );
  } catch (error) {
    // Wholesaler not found (manual throw)
    if (error.message === "WHOLESALER_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    // Invalid enum value or constraint
    if (error.code === "22P02") {
      const err = new Error("INVALID_STATUS_ENUM");
      err.statusCode = 400;
      throw err;
    }

    // Foreign key violation
    if (error.code === "23503") {
      const err = new Error("INVALID_REFERENCE");
      err.statusCode = 400;
      throw err;
    }

    // Not null violation
    if (error.code === "23502") {
      const err = new Error("MISSING_REQUIRED_FIELD");
      err.statusCode = 400;
      throw err;
    }

    throw error; // unknown error bubbles up
  }
};

//delete wholesaler by id
export const deleteWholesalerByIdService = async (wholesalerId) => {
  try {
    return await deleteWholesalerById(wholesalerId);
  } catch (error) {
    if (error.message === "WHOLESALER_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    throw error;
  }
};

//edit wholesaler basic and documents
// EDIT WHOLESALER (USER + BUSINESS + DOCUMENTS)
export const editWholesalerBasicAndDocumentsService = async (
  wholesalerId,
  data,
  adminUser,
) => {
  try {
    return await editWholesalerBasicAndDocuments(wholesalerId, data, adminUser);
  } catch (error) {
    // Wholesaler not found
    if (error.message === "WHOLESALER_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    // Foreign key violation
    if (error.code === "23503") {
      const err = new Error("INVALID_REFERENCE");
      err.statusCode = 400;
      throw err;
    }

    // Not-null constraint violation
    if (error.code === "23502") {
      const err = new Error("MISSING_REQUIRED_FIELD");
      err.statusCode = 400;
      throw err;
    }

    throw error; // unknown errors bubble up
  }
};

export const createWholesalerBankDetailsService = async (
  userId,
  bankDetails,
) => {
  try {
    return await createWholesalerBankDetails(userId, bankDetails);
  } catch (error) {
    // FK violation → user_id not found in users table
    if (error.code === "23503") {
      const err = new Error("USER_NOT_FOUND");
      err.statusCode = 404;
      throw err;
    }

    // Unique index on user_id → bank details already exist
    if (error.code === "23505") {
      const err = new Error("BANK_DETAILS_ALREADY_EXIST");
      err.statusCode = 409;
      throw err;
    }

    throw error;
  }
};

export const getWholesalerBankDetailsByUserIdService = async (userId) => {
  try {
    return await getWholesalerBankDetailsByUserId(userId);
  } catch (error) {
    if (error.message === "BANK_DETAILS_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }
    throw error;
  }
};

export const getAllUsersBankDetailsService = async () => {
  return await getAllUsersBankDetails();
};

export const deleteWholesalerBankDetailsService = async (userId) => {
  try {
    return await deleteWholesalerBankDetailsByUserId(userId);
  } catch (error) {
    if (error.message === "BANK_DETAILS_NOT_FOUND") {
      error.statusCode = 404;
    }
    throw error;
  }
};

export const updateUserBankDetailsService = async (
  userId,
  updateData,
  adminUser,
) => {
  try {
    return await updateUserBankDetails(userId, updateData, adminUser);
  } catch (error) {
    if (error.message === "BANK_DETAILS_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    if (error.message === "NO_FIELDS_TO_UPDATE") {
      error.statusCode = 400;
      throw error;
    }

    // enum / FK / DB constraint errors fall through
    throw error;
  }
};
