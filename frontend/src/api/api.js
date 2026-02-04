import axios from "axios";

// ❗ IMPORTANT: No localhost fallback in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Debug
console.log("API Base URL:", API_BASE_URL);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API ERROR:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
      });
    } else {
      console.error("API NETWORK ERROR:", error.message);
    }
    return Promise.reject(error);
  }
);

// ================= EMPLOYEE API =================
export const employeeAPI = {
  getAll: () => api.get("/api/employees/"),
  create: (data) => {
    console.log("POST /api/employees/ - Request data:", data);
    console.log("API Base URL:", API_BASE_URL);
    return api.post("/api/employees/", data).then(
      (response) => {
        console.log("POST /api/employees/ - Success:", response.data);
        return response;
      },
      (error) => {
        console.error("POST /api/employees/ - Failed:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
        });
        throw error;
      }
    );
  },
  delete: (id) => api.delete(`/api/employees/${id}/`),
};

// ================= ATTENDANCE API =================
export const attendanceAPI = {
  mark: (data) => api.post("/api/attendance/"),
  getAll: () => api.get("/api/attendance/all/"),
  getByEmployee: (employeeId) =>
    api.get(`/api/attendance/${employeeId}/`),
};

export default api;
