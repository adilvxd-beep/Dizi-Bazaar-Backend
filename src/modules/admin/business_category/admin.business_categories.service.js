import e from "express";
import { findAllBusinessCategories, createBusinessCategory, updateBusinessCategory, deleteBusinessCategory, updateBusinessCategoryStatus} from "./admin.business_categories.repository.js";

function formatName(name) {
  if (!name) return name;
  const cleaned = name.trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

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

export const updateExistingBusinessCategoryStatus = async (id, status) => {
  return await updateBusinessCategoryStatus(id, status);
};

export const deleteBusinessCategoryById = async (id) => {
  return await deleteBusinessCategory(id);
};      

