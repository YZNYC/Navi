// frontend/lib/api.js
import axios from 'axios';

// ===============================
// Normalização da URL base
// ===============================
function normalizeUrl(url) {
    return url?.replace(/\/+$/, '') || ''; // remove barras no final
}

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = normalizeUrl(RAW_API_URL);

// ===============================
// Instância Axios
// ===============================
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ===============================
// Interceptor de Token (mantido igual ao seu)
// ===============================
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('authToken');

        if (!token) {
            token = sessionStorage.getItem('authToken');
        }

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ===============================
// Helper buildUrl (para anexos etc.)
// ===============================
export const buildUrl = (path = '') => {
    return `${API_URL}/${path.replace(/^\/+/, '')}`;
};

// ===============================
// Export principal
// ===============================
export default api;
