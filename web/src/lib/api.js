// src/lib/api.js
import axios from 'axios';

// URL de base deve ser configurada em um .env (ex: NEXT_PUBLIC_API_URL=http://localhost:3001/api)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para injetar o JWT em cada requisição
api.interceptors.request.use(
    (config) => {
        // Assumindo que você armazena o token no localStorage após o login
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;