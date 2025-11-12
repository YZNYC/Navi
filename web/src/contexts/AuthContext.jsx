// frontend/contexts/AuthContext.js
'use client';

import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const loadUserFromStorage = useCallback(() => {
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const storedUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Erro ao carregar dados", error);
            localStorage.clear();
            sessionStorage.clear();
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        loadUserFromStorage();
    }, [loadUserFromStorage]);

    const login = (userData, token, rememberMe) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        
        // Define qual a rota de login correspondente ao papel do usuário
        let loginRouteType = 'proprietario'; // Padrão
        if (userData.papel === 'ADMINISTRADOR') loginRouteType = 'admin';
        if (userData.papel === 'GESTOR' || userData.papel === 'OPERADOR') loginRouteType = 'funcionario';

        // Salva as informações
        storage.setItem('authToken', token);
        storage.setItem('usuario', JSON.stringify(userData));
        storage.setItem('loginRouteType', loginRouteType); // <-- SALVA O "TIPO" DE LOGIN

        setUser(userData);
    };

    const logout = useCallback(() => {
        const loginRouteType = localStorage.getItem('loginRouteType') || sessionStorage.getItem('loginRouteType') || 'proprietario';
        
        localStorage.removeItem('usuario');
        localStorage.removeItem('authToken');
        localStorage.removeItem('loginRouteType');
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('loginRouteType');
        
        setUser(null);
        // --- REDIRECIONAMENTO INTELIGENTE ---
        router.push(`/login/${loginRouteType}`); 
    }, [router]);
    
    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            response => response,
            error => {
                const { config, response } = error;
                const isUnauthorized = response?.status === 401;
                const isLoginAttempt = config.url.endsWith('/auth/login');
                
                if (isUnauthorized && !isLoginAttempt) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => api.interceptors.response.eject(responseInterceptor);
    }, [logout]);


    const value = { user, isLoading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);