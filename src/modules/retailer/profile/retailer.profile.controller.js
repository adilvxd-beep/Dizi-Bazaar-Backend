import * as retailerProfileService from "./retailer.profile.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import ApiError from "../../../shared/utils/ApiError.js";

export const getProfile = async (req, res, next) => {
  try {
    const profile = await retailerProfileService.getRetailerProfile(req.user.id);
    if (!profile) {
      return res.status(200).json(new ApiResponse(200, null, "Retailer profile not found"));
    }
    res.json(new ApiResponse(200, profile));
  } catch (error) {
    next(new ApiError(500, error.message));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await retailerProfileService.updateRetailerProfile(req.user.id, req.body);
    res.json(new ApiResponse(200, profile, "Profile updated successfully"));
  } catch (error) {
    next(new ApiError(500, error.message));
  }
};
