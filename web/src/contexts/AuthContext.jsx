// frontend/contexts/AuthContext.js
'use client';

import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api'; // Importamos o api para o interceptor de logout

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const loadUserFromStorage = useCallback(() => {
        // Unifica a lógica de carregamento
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const storedUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
            
            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Erro ao carregar dados de autenticação do storage", error);
            // Limpa o storage se estiver corrompido
            localStorage.clear();
            sessionStorage.clear();
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        loadUserFromStorage();
    }, [loadUserFromStorage]);

    // --- A FUNÇÃO CHAVE ---
    // Esta função será chamada pelo seu LoginForm
    const login = (userData, token, rememberMe) => {
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem('authToken', token);
        storage.setItem('usuario', JSON.stringify(userData));

        setUser(userData); // ATUALIZA O ESTADO IMEDIATAMENTE!
    };

    const logout = () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('authToken');
        setUser(null);
        router.push('/');
    };
    
    // Configura um interceptor para deslogar em caso de erro 401
    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        // Função de limpeza para remover o interceptor
        return () => api.interceptors.response.eject(responseInterceptor);
    }, []);


    const value = { user, isLoading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);