// frontend/lib/api.js
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para injetar o JWT em cada requisição
api.interceptors.request.use(
    (config) => {
        // CORREÇÃO: Usando a chave correta 'authToken' 
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken'); 
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Exportar o 'api' para ser usado diretamente (Ex: api.get('/usuarios'))
export default api;