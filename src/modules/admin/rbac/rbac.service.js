import * as repository from "./rbac.repository.js";

export const getAllRoles = async () => await repository.findAllRoles();
export const addRole = async (data) => await repository.createRole(data);
export const editRole = async (id, data) => await repository.updateRole(id, data);
export const removeRole = async (id) => await repository.deleteRole(id);

export const getAllPermissions = async () => await repository.findAllPermissions();
