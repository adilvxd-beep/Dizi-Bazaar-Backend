import {getAllCategories, getCategoryById, createNewCategory, updateCategoryById, changeCategoryStatus, removeCategoryById} from "./admin.categories.service.js";
import ApiError from "../../../shared/utils/ApiError.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getCategory = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);
        const category = await getCategoryById(categoryId);
        res.json(new ApiResponse(200, category));
    } catch (error) {
        next(new ApiError(400, error.message));
    }           
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategories(req.query);
        res.json(new ApiResponse(200, categories));
    } catch (error) {
        next(new ApiError(400, error.message));
    }           
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await createNewCategory(req.body);
    res.status(201).json(new ApiResponse(201, category));
  } catch (error) {
    next(new ApiError(400, error.message)); //FIXED
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    const updatedCategory = await updateCategoryById(categoryId, req.body);
    if (!updatedCategory) {
      return next(new ApiError(404, "Category not found"));
    }
    res.json(new ApiResponse(200, updatedCategory));
  } catch (error) {
    next(new ApiError(400, error.message));
  }         
};

export const UpdateCategoryStatus = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);     
    const { status } = req.body;
    const updatedCategory = await changeCategoryStatus(categoryId, status);
    if (!updatedCategory) {
      return next(new ApiError(404, "Category not found"));
    }
    res.json(new ApiResponse(200, updatedCategory));
  } catch (error) {
    next(new ApiError(400, error.message));
  }         
};

export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    const deletedCategory = await removeCategoryById(categoryId);
    if (!deletedCategory) {
      return next(new ApiError(404, "Category not found"));
    }
    res.json(new ApiResponse(200, deletedCategory));
  } catch (error) {
    next(new ApiError(400, error.message));
  }         
};
