// lib/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bazario-backend-vmlz.onrender.com/api", // 👈 set your base URL once
});

// Automatically attach token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
