// src/utils/api.js

// Porta do Servidor Express (Backend) para chamadas explícitas
const EXPRESS_API_URL = 'http://localhost:3000'; 

/**
 * Obtém o token JWT do localStorage de forma segura.
 * AJUSTE 'jwtToken' para a chave que você usa no seu localStorage.
 */
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwtToken'); 
    }
    return null;
};

/**
 * Função fetch customizada que adiciona o Authorization Header e a URL base do Express.
 */
export const apiFetch = async (url, options = {}) => {
    const token = getAuthToken();
    
    // Configuração de Headers
    const headers = {
        // Garantir que o Content-Type é JSON, a menos que seja um upload
        'Content-Type': 'application/json', 
        ...options.headers,
    };

    // INJETA O TOKEN NO HEADER
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Define a URL final (Express + rota)
    const finalUrl = `${EXPRESS_API_URL}${url}`;
    
    return fetch(finalUrl, {
        ...options,
        // Sobrescreve o headers com o novo objeto (incluindo o Token)
        headers, 
    });
};