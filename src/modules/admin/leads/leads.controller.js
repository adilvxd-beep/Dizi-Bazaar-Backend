import * as service from "./leads.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export const getInvestmentLeads = async (req, res, next) => {
  try {
    const leads = await service.getInvestmentLeads();
    res.json(new ApiResponse(200, leads));
  } catch (error) {
    next(error);
  }
};

export const createInvestmentLead = async (req, res, next) => {
  try {
    const lead = await service.submitInvestmentLead(req.body);
    res.status(201).json(new ApiResponse(201, lead, "Investment request submitted successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateInvestmentLeadStatus = async (req, res, next) => {
  try {
    const lead = await service.setInvestmentLeadStatus(req.params.id, req.body.status);
    res.json(new ApiResponse(200, lead));
  } catch (error) {
    next(error);
  }
};

export const getAgentApplications = async (req, res, next) => {
  try {
    const apps = await service.getAgentApplications();
    res.json(new ApiResponse(200, apps));
  } catch (error) {
    next(error);
  }
};

export const createAgentApplication = async (req, res, next) => {
  try {
    const app = await service.submitAgentApplication(req.body);
    res.status(201).json(new ApiResponse(201, app, "Agent application submitted successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateAgentApplicationStatus = async (req, res, next) => {
  try {
    const app = await service.setAgentApplicationStatus(req.params.id, req.body.status);
    res.json(new ApiResponse(200, app));
  } catch (error) {
    next(error);
  }
};
