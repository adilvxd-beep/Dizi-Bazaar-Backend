import { getAllAgents, updateAgentInfo } from "./agent.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";

export const getAgents = async (req, res, next) => {
  try {
    const agents = await getAllAgents();
    res.json(new ApiResponse(200, agents));
  } catch (error) {
    next(error);
  }
};

export const updateAgent = async (req, res, next) => {
  try {
    const agent = await updateAgentInfo(req.params.id, req.body);
    res.json(new ApiResponse(200, agent));
  } catch (error) {
    next(error);
  }
};
