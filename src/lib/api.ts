import axios from 'axios';

const API_BASE_URL = 'https://newsfootbackend-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (password: string) => {
  const response = await api.post('/api/login', { password });
  const { token } = response.data;
  localStorage.setItem('token', token);
  return token;
};

export const getArticles = async () => {
  const response = await api.get('/api/articles');
  return response.data;
};

export const getArticle = async (id: number) => {
  const response = await api.get(`/api/articles/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/api/categories');
  return response.data;
};

export const getAuthors = async () => {
  const response = await api.get('/api/auteurs');
  return response.data;
};

export const getVideos = async () => {
  const response = await api.get('/api/videos');
  return response.data;
};

export const getLatestVideo = async () => {
  const response = await api.get('/api/videos/latest');
  return response.data;
};

export default api; 