// frontend/lib/api.js
import axios from 'axios';

// A URL do seu backend. Se estiver rodando na porta 3000, ajuste aqui.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- INTERCEPTOR CORRIGIDO ---
api.interceptors.request.use(
    (config) => {
        let token;
        
        // 1. Procura o token primeiro no localStorage...
        token = localStorage.getItem('authToken'); 
        
        // 2. ...se не o encontrar, procura no sessionStorage.
        if (!token) {
            token = sessionStorage.getItem('authToken');
        }

        // 3. Se um token foi encontrado em qualquer um dos locais, injeta no cabeçalho.
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