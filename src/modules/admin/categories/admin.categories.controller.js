import {getAllCategories, createNewCategory} from "./admin.categories.service.js";
import ApiError from "../../../shared/utils/ApiError.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategories(req.categoryData);
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
        next(new ApiError(401, error.message));
    }                     
};
