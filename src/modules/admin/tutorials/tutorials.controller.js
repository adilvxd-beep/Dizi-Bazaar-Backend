import * as service from "./tutorials.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getTutorials = async (req, res, next) => {
  try {
    const tutorials = await service.getAllTutorials();
    res.json(new ApiResponse(200, tutorials));
  } catch (error) {
    next(error);
  }
};

export const getTutorialsByRole = async (req, res, next) => {
  try {
    const tutorials = await service.getTutorialsByRole(req.params.role);
    res.json(new ApiResponse(200, tutorials));
  } catch (error) {
    next(error);
  }
};

export const createTutorial = async (req, res, next) => {
  try {
    const tutorial = await service.addTutorial(req.body);
    res.status(201).json(new ApiResponse(201, tutorial));
  } catch (error) {
    next(error);
  }
};

export const updateTutorial = async (req, res, next) => {
  try {
    const tutorial = await service.editTutorial(req.params.id, req.body);
    res.json(new ApiResponse(200, tutorial));
  } catch (error) {
    next(error);
  }
};

export const deleteTutorial = async (req, res, next) => {
  try {
    await service.removeTutorial(req.params.id);
    res.json(new ApiResponse(200, null, "Tutorial deleted successfully"));
  } catch (error) {
    next(error);
  }
};
