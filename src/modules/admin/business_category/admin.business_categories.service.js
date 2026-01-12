import e from "express";
import { findAllBusinessCategories, createBusinessCategory, updateBusinessCategory, deleteBusinessCategory, updateBusinessCategoryStatus} from "./admin.business_categories.repository.js";

export const getAllBusinessCategories = async (query) => {
  return await findAllBusinessCategories(query);
};


export const createNewBusinessCategory = async (categoryData) => {
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

