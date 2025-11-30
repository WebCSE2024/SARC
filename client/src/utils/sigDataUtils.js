import { authAPI, sarcAPI } from "../../../../shared/axios/axiosInstance";

// Fetch all SIGs from SARC API
export const fetchAllSIGs = async () => {
  const response = await sarcAPI.get("/sig");
  return response.data;
};

// Fetch SIG by ID from SARC API
export const fetchSIGById = async (sigId) => {
  const response = await sarcAPI.get(`sarc/v0/sig/${sigId}`);
  return response.data;
};

// Fetch professors by SIG from auth-system API
export const fetchProfessorsBySIG = async (sigId) => {
  const response = await authAPI.get(`auth-system/v0/user/professors/sig/${sigId}`);  
  return response.data;
};

// Fetch projects by SIG from SARC API
export const fetchProjectsBySIG = async (sigId) => {
  const response = await sarcAPI.get(`sarc/v0/sig/${sigId}/projects`);
  return response.data;
};

// Fetch project years by SIG
export const fetchProjectYearsBySIG = async (sigId) => {
  const response = await sarcAPI.get(`sarc/v0/sig/${sigId}/projects/years`);
  return response.data;
};

// Fetch single project by ID
export const fetchProjectById = async (projectId) => {
  const response = await sarcAPI.get(`sarc/v0/sig/project/${projectId}`);
  return response.data;
};
