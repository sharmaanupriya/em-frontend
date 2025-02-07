import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api", // ✅ Ensure single /api, not /api/api
  baseURL: "https://em-backend-wcn4.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
