import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Log API base URL for debugging
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('API Error Response:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
            });
        } else if (error.request) {
            // Request was made but no response received
            console.error('API No Response:', {
                url: error.config?.url,
                message: error.message,
            });
        } else {
            // Error in request setup
            console.error('API Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Employee API endpoints
export const employeeAPI = {
    // Get all employees
    getAll: () => api.get('/api/employees/'),

    // Create a new employee
    create: (data) => api.post('/api/employees/', data),

    // Delete an employee
    delete: (id) => api.delete(`/api/employees/${id}/`),
};

// Attendance API endpoints
export const attendanceAPI = {
    // Mark attendance
    mark: (data) => api.post('/api/attendance/', data),

    // Get all attendance records
    getAll: (date = null) => {
        const params = date ? { date } : {};
        return api.get('/api/attendance/all/', { params });
    },

    // Get attendance for specific employee
    getByEmployee: (employeeId, date = null) => {
        const params = date ? { date } : {};
        return api.get(`/api/attendance/${employeeId}/`, { params });
    },
};

export default api;
