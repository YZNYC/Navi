// src/contexts/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    
    // Este useEffect só roda no cliente e define o usuário se um token existir.
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                const decodedUser = jwtDecode(storedToken);
                setUser(decodedUser);
            }
        } catch (error) {
            setUser(null);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        window.location.href = '/login'; // Redireciona para o login
    };
    
    // A única informação que o contexto precisa expor é o usuário e a função de logout.
    const value = { user, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para usar em outros componentes.
export const useAuth = () => {
    return useContext(AuthContext);
};