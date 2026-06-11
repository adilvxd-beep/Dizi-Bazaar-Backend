import * as service from "./operations.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getShifts = async (req, res, next) => {
  try {
    const shifts = await service.getShifts();
    res.json(new ApiResponse(200, shifts));
  } catch (error) {
    next(error);
  }
};

export const createShift = async (req, res, next) => {
  try {
    const shift = await service.addShift(req.body);
    res.status(201).json(new ApiResponse(201, shift));
  } catch (error) {
    next(error);
  }
};

export const updateShift = async (req, res, next) => {
  try {
    const shift = await service.editShift(req.params.id, req.body);
    res.json(new ApiResponse(200, shift));
  } catch (error) {
    next(error);
  }
};

export const deleteShift = async (req, res, next) => {
  try {
    await service.removeShift(req.params.id);
    res.json(new ApiResponse(200, null, "Shift deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getRanges = async (req, res, next) => {
  try {
    const ranges = await service.getRanges();
    res.json(new ApiResponse(200, ranges));
  } catch (error) {
    next(error);
  }
};

export const createRange = async (req, res, next) => {
  try {
    const range = await service.addRange(req.body);
    res.status(201).json(new ApiResponse(201, range));
  } catch (error) {
    next(error);
  }
};

export const updateRange = async (req, res, next) => {
  try {
    const range = await service.editRange(req.params.id, req.body);
    res.json(new ApiResponse(200, range));
  } catch (error) {
    next(error);
  }
};

export const deleteRange = async (req, res, next) => {
  try {
    await service.removeRange(req.params.id);
    res.json(new ApiResponse(200, null, "Delivery range deleted successfully"));
  } catch (error) {
    next(error);
  }
};
