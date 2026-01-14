import { findAllCategories, findCategoryById, createCategory, getBusinessCategoryStatusRepo , updateCategoryRepo, toggleCategoryStatusRepo,  deleteCategoryById } from "./admin.categories.repository.js";

import pool from "../../../shared/db/postgres.js";

function formatName(name) {
  if (!name) return name;
  const cleaned = name.trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export const getCategoryById = async (categoryId) => {
  if (!categoryId) {
    throw new Error("Category id is required");
  }

  const category = await findCategoryById(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

export const getAllCategories = async (query) => {
  return await findAllCategories(query);
};         

export const createNewCategory = async (categoryData) => {
  const { name, business_category_id, image_url, status } = categoryData;

  if (!business_category_id) {
    throw new Error("business_category_id is required");
  }

  return await createCategory({
    name: formatName(name),
    business_category_id: Number(business_category_id),
    image_url,
    status
  });
};

export const updateCategoryById = async (categoryId, updateData) => {
  if (!categoryId) {
    throw new Error("Category id is required");
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error("No data provided to update");
  }

  // format name
  if (updateData.name) {
    updateData.name = formatName(updateData.name);
  }

  // Business rule: validate business category change
  if (updateData.business_category_id) {
    const businessCategory =
      await getBusinessCategoryStatusRepo(updateData.business_category_id);

    if (!businessCategory) {
      throw new Error("Business category does not exist");
    }

    if (businessCategory.status !== "active") {
      throw new Error("Cannot assign category to inactive business category");
    }
  }

  const updatedCategory = await updateCategoryRepo(categoryId, updateData);

  if (!updatedCategory) {
    throw new Error("Category not found");
  }

  return updatedCategory;
};

export const toggleCategoryStatusService = async (categoryId) => {
  const result = await toggleCategoryStatusRepo(categoryId);
  if (result.rowCount === 0) {
    throw new Error("Category not found");
  }
  return result.rows[0];    
};


export const removeCategoryById = async (categoryId) => {
  return await deleteCategoryById(categoryId);
};  
