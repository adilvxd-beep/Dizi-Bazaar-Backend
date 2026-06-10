import * as agentProfileRepository from "./agent.profile.repository.js";

export const getAgentProfile = async (id) => {
  return await agentProfileRepository.findAgentProfileById(id);
};

export const updateAgentProfile = async (id, data) => {
  return await agentProfileRepository.updateAgentProfile(id, data);
};
