import {
  createWholesaler,
  updateWholesalerDocuments
} from "./admin.wholesaler.repository.js";

export const createWholesalerService = async (data, user) => {
  try {
    return await createWholesaler(data, user);
  } catch (error) {
    // postgres unique violation
    if (error.code === "23505") {
      const err = new Error("DUPLICATE_WHOLESALER");
      err.code = "DUPLICATE_WHOLESALER";
      throw err;
    }

    throw error; // let controller / global handler decide
  }
};

export const updateWholesalerDocumentsService = async (
  wholesalerId,
  updates
) => {
  if (!wholesalerId) {
    const err = new Error("WHOLESALER_ID_REQUIRED");
    err.code = "WHOLESALER_ID_REQUIRED";
    throw err;
  }

  if (!updates || Object.keys(updates).length === 0) {
    const err = new Error("NO_DOCUMENT_UPDATES");
    err.code = "NO_DOCUMENT_UPDATES";
    throw err;
  }

  try {
    const documents = await updateWholesalerDocuments(
      wholesalerId,
      updates
    );

    if (!documents) {
      const err = new Error("DOCUMENTS_NOT_FOUND");
      err.code = "DOCUMENTS_NOT_FOUND";
      throw err;
    }

    return documents;
  } catch (error) {
    throw error;
  }
};
