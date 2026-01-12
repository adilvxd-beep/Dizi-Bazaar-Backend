import { getAllBusinessCategories, createNewBusinessCategory, updateExistingBusinessCategory, deleteBusinessCategoryById, updateExistingBusinessCategoryStatus} from "./admin.business_categories.service.js";
import ApiError from "../../../shared/utils/ApiError.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getBusinessCategories = async (req, res, next) => {
  try {
    const categories = await getAllBusinessCategories(req.query);

    res.json(new ApiResponse(200, categories));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};


export const createBusinessCategory = async (req, res, next) => {
    
    try {
        const category = await createNewBusinessCategory(req.body);
        res.status(201).json(new ApiResponse(201, category)); 
    } catch (error) {
            next(new ApiError(401, error.message));

    }                     
};

export const updateBusinessCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await updateExistingBusinessCategory(id, req.body);
        res.json(new ApiResponse(200, category)); 
    } catch (error) {
            next(new ApiError(401, error.message));

    }                     
};  

export const updateBusinessCategoryStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const category = await updateExistingBusinessCategoryStatus(id, status);
        res.json(new ApiResponse(200, category)); 
    } catch (error) {
            next(new ApiError(401, error.message));
    }
};  

export const deleteBusinessCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
        await deleteBusinessCategoryById(id);
        res.json(new ApiResponse(200, { message: "Business category deleted successfully" })); 
    } catch (error) {
            next(new ApiError(401, error.message));
    }
};