import axios from "axios";

// Use environment variable for the backend root (without /api)
const BACKEND_ROOT =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://sami-ministry.onrender.com"
    : "http://localhost:8000");

const api = axios.create({
  baseURL: `${BACKEND_ROOT}/api`, // 👈 ensures /api is always added
  headers: { "Content-Type": "application/json" },
});

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL ||
//   (import.meta.env.DEV
//     ? "http://localhost:8000/api"
//     : "https://remsamintegration.onrender.com/api");

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - let axios handle it automatically
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("userInfo");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

export default api;
