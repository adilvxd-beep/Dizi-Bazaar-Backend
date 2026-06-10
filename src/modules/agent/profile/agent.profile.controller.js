import * as agentProfileService from "./agent.profile.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import ApiError from "../../../shared/utils/ApiError.js";

export const getProfile = async (req, res, next) => {
  try {
    const profile = await agentProfileService.getAgentProfile(req.user.id);
    if (!profile) {
      return next(new ApiError(404, "Agent profile not found"));
    }
    res.json(new ApiResponse(200, profile));
  } catch (error) {
    next(new ApiError(500, error.message));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await agentProfileService.updateAgentProfile(req.user.id, req.body);
    res.json(new ApiResponse(200, profile, "Profile updated successfully"));
  } catch (error) {
    next(new ApiError(500, error.message));
  }
};
