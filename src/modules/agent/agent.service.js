import { findAllAgents, updateAgent } from "./agent.repository.js";

export const getAllAgents = async () => {
  return await findAllAgents();
};

export const updateAgentInfo = async (id, data) => {
  const { username, email } = data;
  return await updateAgent(id, username, email);
};
