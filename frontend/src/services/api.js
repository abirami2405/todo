import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },
  facebookLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/facebook`;
  },
  
  githubLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  }
};

export const tasksAPI = {
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },
  
  deleteTask: async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
  }
};

export default api;
