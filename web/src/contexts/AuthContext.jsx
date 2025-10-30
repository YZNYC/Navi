// src/contexts/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

    useEffect(() => {
        try {
            const nome = localStorage.getItem('userName');
            const email = localStorage.getItem('userEmail');
            const papel = localStorage.getItem('userRole');

            if (nome && email && papel) {
                setUser({ nome, email, papel });
            }
        } catch (error) {
            console.error("Falha ao ler os dados do usuário do localStorage", error);
            setUser(null);
        } finally {
            setIsLoading(false); // Finaliza o carregamento
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        setUser(null);
        window.location.href = '/login';
    };
    
    const value = { user, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};