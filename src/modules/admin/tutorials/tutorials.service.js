import * as repository from "./tutorials.repository.js";

export const getAllTutorials = async () => await repository.findAllTutorials();
export const getTutorialsByRole = async (role) => await repository.findTutorialsByRole(role);
export const addTutorial = async (data) => await repository.createTutorial(data);
export const editTutorial = async (id, data) => await repository.updateTutorial(id, data);
export const removeTutorial = async (id) => await repository.deleteTutorial(id);
