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

export default API;