import axios from 'axios';

const API_URL = 'http://192.168.91.125:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ---- Token refresh interceptor ----
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue any requests that come in while a refresh is already in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
                localStorage.clear();
                window.location.href = '/auth';
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                // Store new tokens (rotation gives a new refresh token too)
                localStorage.setItem('access_token', data.access);
                if (data.refresh) {
                    localStorage.setItem('refresh_token', data.refresh);
                }

                processQueue(null, data.access);
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh token itself has expired — force logout
                processQueue(refreshError, null);
                localStorage.clear();
                window.location.href = '/auth';
                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// ---- API methods (unchanged) ----
export const authAPI = {
    register: (userData) => api.post('/auth/register/', userData),
    login: (credentials) => api.post('/auth/login/', credentials),
    logout: (refreshToken) => api.post('/auth/logout/', { refresh_token: refreshToken }),
    refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
};

export const projectsAPI = {
    getAll: () => api.get('/projects/'),
    getStats: () => api.get('/projects/stats/'),
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