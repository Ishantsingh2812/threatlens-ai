import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getThreats = async () => {
  const response = await API.get("/api/threats");
  return response.data;
};

export const getLogs = async () => {
  const response = await API.get("/api/logs");
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await API.get("/api/dashboard/stats");
  return response.data;
};

export const getThreatActivity = async () => {
  const response = await API.get("/api/dashboard/threat-activity");
  return response.data;
};

export const getThreatTypeDistribution = async () => {
  const response = await API.get("/api/dashboard/threat-types");
  return response.data;
};

export const getRecentThreats = async () => {
  const response = await API.get("/api/dashboard/recent-threats");
  return response.data;
};

export const getTopAttackingIps = async () => {
  const response = await API.get("/api/dashboard/top-attacking-ips");
  return response.data;
};

export const updateThreatStatus = async (id, status) => {
  const response = await API.put(
    `/api/threats/${id}/status`,
    null,
    {
      params: { status },
    }
  );

  return response.data;
};

export const getThreatById = async (id) => {
  const response = await API.get(`/api/threats/${id}`);
  return response.data;
};

export const sendCopilotMessage = async (message) => {
  const response = await API.post(
    "/api/copilot/chat",
    { message }
  );

  return response.data;
};

export const analyzeThreat = async (log) => {
  const response = await API.post(
    "/api/analyzer/analyze",
    { log }
  );

  return response.data;
};



export default API;