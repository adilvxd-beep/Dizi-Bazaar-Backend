import { findAllBusinessCategories, findBusinessCategoryById, createBusinessCategory, updateBusinessCategory, updateRestrictedBusinessCategoryStatus, deleteBusinessCategory} from "./admin.business_categories.repository.js";

function formatName(name) {
  if (!name) return name;
  const cleaned = name.trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export const getBusinessCategoryById = async (id) => {
  return await findBusinessCategoryById(id);
};

export const getAllBusinessCategories = async (query) => {
  return await findAllBusinessCategories(query);
};


export const createNewBusinessCategory = async (categoryData) => {
  const { name, status } = categoryData;
  categoryData.name = formatName(name);
  categoryData.status = status.trim().toLowerCase();
  return await createBusinessCategory(categoryData);
};

export const updateExistingBusinessCategory = async (id, categoryData) => {
  return await updateBusinessCategory(id, categoryData);
};

//update status with restrictions
export const changeBusinessCategoryStatus = async (id, status) => {
  if (!id) {
    throw new Error("Business category id is required");
  }

  if (!["active", "inactive"].includes(status)) {
    throw new Error("Invalid status value");
  }

  return await updateRestrictedBusinessCategoryStatus(Number(id), status);
};

export const deleteBusinessCategoryById = async (id) => {
  return await deleteBusinessCategory(id);
};      

