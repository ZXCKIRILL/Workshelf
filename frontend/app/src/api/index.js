// src/api/index.js
import { get, post } from "./http";
import axios from 'axios';
const api = axios.create({
  baseURL: 'https://localhost:7040/swagger/index.html', // Замени на свой URL бэкенда
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;