import * as service from "./rbac.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getRoles = async (req, res, next) => {
  try {
    const roles = await service.getAllRoles();
    res.json(new ApiResponse(200, roles));
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const role = await service.addRole(req.body);
    res.status(201).json(new ApiResponse(201, role));
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const role = await service.editRole(req.params.id, req.body);
    res.json(new ApiResponse(200, role));
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    await service.removeRole(req.params.id);
    res.json(new ApiResponse(200, null, "Role deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getPermissions = async (req, res, next) => {
  try {
    const permissions = await service.getAllPermissions();
    res.json(new ApiResponse(200, permissions));
  } catch (error) {
    next(error);
  }
};
