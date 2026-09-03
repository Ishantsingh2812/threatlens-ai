import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
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

export default API;