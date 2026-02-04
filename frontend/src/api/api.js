import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

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
