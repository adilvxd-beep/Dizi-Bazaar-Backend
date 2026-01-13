import { findAllCategories, createCategory, updateCategory, deleteCategoryById } from "./admin.categories.repository.js";

function formatName(name) {
  if (!name) return name;
  const cleaned = name.trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
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

  if (updateData.name) {
    updateData.name = formatName(updateData.name);
  }

  // 🔐 Business rule: validate business category change
  if (updateData.business_category_id) {
    const result = await pool.query(
      "SELECT status FROM business_categories WHERE id = $1",
      [updateData.business_category_id]
    );

    if (result.rowCount === 0) {
      throw new Error("Business category does not exist");
    }

    if (result.rows[0].status !== "active") {
      throw new Error("Cannot assign category to inactive business category");
    }
  }

  return await updateCategory(categoryId, updateData);
};

export const removeCategoryById = async (categoryId) => {
  return await deleteCategoryById(categoryId);
};  
