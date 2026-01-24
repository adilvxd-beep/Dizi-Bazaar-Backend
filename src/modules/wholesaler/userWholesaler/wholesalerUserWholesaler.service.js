import {
  createWholesaler,
  createWholesalerDocuments,
  updateWholesalerAndDocuments,
} from "./wholesalerUserWholesaler.repository.js";

export const createWholesalerService = async (data, user) => {
  try {
    return await createWholesaler(data, user);

  } catch (error) {

    /* =========================
       WHOLESALER ALREADY EXISTS
    ========================= */
    if (error.message === "WHOLESALER_ALREADY_EXISTS") {
      error.statusCode = 409; // Conflict
      throw error;
    }

    /* =========================
       INVALID BUSINESS CATEGORY (FK)
    ========================= */
    if (error.code === "23503") {
      const err = new Error("INVALID_BUSINESS_CATEGORY");
      err.statusCode = 400;
      throw err;
    }

    /* =========================
       INVALID ENUM VALUE (STATUS, ROLE)
    ========================= */
    if (error.code === "22P02") {
      const err = new Error("INVALID_INPUT");
      err.statusCode = 400;
      throw err;
    }

    /* =========================
       FALLBACK
    ========================= */
    error.statusCode = error.statusCode || 500;
    throw error;
  }
};

export const createWholesalerDocumentsService = async (data, user) => {
  try {
    return await createWholesalerDocuments(data, user);

  } catch (error) {

    if (error.message === "WHOLESALER_NOT_FOUND") {
      error.statusCode = 404;
      throw error;
    }

    if (error.message === "DOCUMENTS_ALREADY_SUBMITTED") {
      error.statusCode = 409;
      throw error;
    }

    if (error.code === "23503") {
      error.statusCode = 400;
      error.message = "INVALID_REFERENCE";
      throw error;
    }

    error.statusCode = error.statusCode || 500;
    throw error;
  }
};

//update wholesaler and documents
export const updateWholesalerService = async (data, user) => {
  try {
    return await updateWholesalerAndDocuments(data, user);
  } catch (error) {
    if (error.code === "23505") {
      error.statusCode = 409;
      error.message = "DUPLICATE_VALUE";
    }
    error.statusCode = error.statusCode || 500;
    throw error;
  }
};
