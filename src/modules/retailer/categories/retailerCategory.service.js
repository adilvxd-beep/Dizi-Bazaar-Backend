import { findAllCategoriesForRetailer } from "./retailerCategory.repository.js"

export const findAllCategoriesForRetailerService = async () => {
  return await findAllCategoriesForRetailer();
};

