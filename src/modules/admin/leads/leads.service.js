import * as repository from "./leads.repository.js";

export const getInvestmentLeads = async () => await repository.findAllInvestmentLeads();
export const submitInvestmentLead = async (data) => await repository.createInvestmentLead(data);
export const setInvestmentLeadStatus = async (id, status) => await repository.updateInvestmentLeadStatus(id, status);

export const getAgentApplications = async () => await repository.findAllAgentApplications();
export const submitAgentApplication = async (data) => await repository.createAgentApplication(data);
export const setAgentApplicationStatus = async (id, status) => await repository.updateAgentApplicationStatus(id, status);
