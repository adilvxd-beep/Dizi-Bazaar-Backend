import * as repository from "./operations.repository.js";

export const getShifts = async () => await repository.findAllShifts();
export const addShift = async (data) => await repository.createShift(data);
export const editShift = async (id, data) => await repository.updateShift(id, data);
export const removeShift = async (id) => await repository.deleteShift(id);

export const getRanges = async () => await repository.findAllRanges();
export const addRange = async (data) => await repository.createRange(data);
export const editRange = async (id, data) => await repository.updateRange(id, data);
export const removeRange = async (id) => await repository.deleteRange(id);
