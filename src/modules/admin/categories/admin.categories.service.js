import e from "express";
import { findAllCategories, createCategory } from "./admin.categories.repository.js";

function formatName(name) {
  if (!name) return name;
  const cleaned = name.trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export const getAllCategories = async (categoryData) => {
  return await findAllCategories(categoryData);
};         

export const createNewCategory = async (categoryData) => { 
    const { name, business_category_id, image_url ,status} = categoryData;
   
    return await createCategory({
        name: formatName(name),
        business_category_id: Number(business_category_id),
        image_url,
        status
    });
};