import {
  createCustomFieldDefinition,
  findAllCustomFieldDefinitions,
  findCustomFieldDefinitionById,
  findCustomFieldsByModule,
  updateCustomFieldDefinition,
  deleteCustomFieldDefinition,
} from "./customField.repository.js";

/**
 * CREATE
 */
export const createCustomField = async (data) => {
  return await createCustomFieldDefinition(data);
};

/**
 * READ ALL
 */
export const getAllCustomFields = async () => {
  return await findAllCustomFieldDefinitions();
};

/**
 * READ BY ID
 */
export const getCustomFieldById = async (id) => {
  return await findCustomFieldDefinitionById(id);
};

/**
 * READ BY MODULE
 */
export const getCustomFieldsByModule = async (module) => {
  return await findCustomFieldsByModule(module);
};

/**
 * UPDATE
 */
export const updateCustomField = async (id, data) => {
  return await updateCustomFieldDefinition(id, data);
};

/**
 * DELETE
 */
export const deleteCustomField = async (id) => {
  return await deleteCustomFieldDefinition(id);
};
