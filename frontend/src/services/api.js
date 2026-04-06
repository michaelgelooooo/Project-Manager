import axios from 'axios';

// Base URL for your Django API
const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) => api.post('/auth/register/', userData),
    login: (credentials) => api.post('/auth/login/', credentials),
    logout: (refreshToken) => api.post('/auth/logout/', { refresh_token: refreshToken }),
    refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
};

export const projectsAPI = {
    getAll: () => api.get('/projects/'),
    getById: (id) => api.get(`/projects/${id}/`),
    create: (projectData) => api.post('/projects/', projectData),
    update: (id, projectData) => api.put(`/projects/${id}/`, projectData),
    partialUpdate: (id, projectData) => api.patch(`/projects/${id}/`, projectData),
    delete: (id) => api.delete(`/projects/${id}/`),
};

export const tasksAPI = {
    getAll: () => api.get('/tasks/'),
    getById: (id) => api.get(`/tasks/${id}/`),
    create: (taskData) => api.post('/tasks/', taskData),
    update: (id, taskData) => api.put(`/tasks/${id}/`, taskData),
    partialUpdate: (id, taskData) => api.patch(`/tasks/${id}/`, taskData),
    delete: (id) => api.delete(`/tasks/${id}/`),
};

export const resourcesAPI = {
    getAll: () => api.get('/resources/'),
    getById: (id) => api.get(`/resources/${id}/`),
    create: (resourceData) => api.post('/resources/', resourceData),
    update: (id, resourceData) => api.put(`/resources/${id}/`, resourceData),
    partialUpdate: (id, resourceData) => api.patch(`/resources/${id}/`, resourceData),
    delete: (id) => api.delete(`/resources/${id}/`),
};

export const dashboardAPI = {
    getData: () => api.get('/dashboard/'),
};

export default api;