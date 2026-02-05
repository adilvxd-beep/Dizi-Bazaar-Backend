import {
  createCustomField,
  getAllCustomFields,
  getCustomFieldById,
  getCustomFieldsByModule,
  updateCustomField,
  deleteCustomField,
} from "./customField.service.js";

import ApiResponse from "../../../shared/utils/ApiResponse.js";

/**
 * CREATE
 */
export const createCustomFieldDefinition = async (req, res, next) => {
  try {
    const field = await createCustomField(req.body);
    res.json(new ApiResponse(201, field));
  } catch (error) {
    next(error);
  }
};

/**
 * READ ALL
 */
export const getCustomFieldDefinitions = async (req, res, next) => {
  try {
    const fields = await getAllCustomFields();
    res.json(new ApiResponse(200, fields));
  } catch (error) {
    next(error);
  }
};

/**
 * READ BY ID
 */
export const getCustomFieldDefinition = async (req, res, next) => {
  try {
    const field = await getCustomFieldById(req.params.id);
    res.json(new ApiResponse(200, field));
  } catch (error) {
    next(error);
  }
};

/**
 * READ BY MODULE
 */
export const getCustomFieldDefinitionsByModule = async (req, res, next) => {
  try {
    const fields = await getCustomFieldsByModule(req.params.module);
    res.json(new ApiResponse(200, fields));
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE
 */
export const updateCustomFieldDefinition = async (req, res, next) => {
  try {
    const field = await updateCustomField(req.params.id, req.body);
    res.json(new ApiResponse(200, field));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE
 */
export const deleteCustomFieldDefinition = async (req, res, next) => {
  try {
    const field = await deleteCustomField(req.params.id);
    res.json(new ApiResponse(200, field));
  } catch (error) {
    next(error);
  }
};
