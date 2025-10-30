// src/contexts/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Começa carregando

    useEffect(() => {
        try {
            // Lemos a string 'usuario' que foi salva no login
            const storedUser = localStorage.getItem('usuario');
            
            // Se a string existir, nós a transformamos de volta em um objeto
            if (storedUser) {
                const userObject = JSON.parse(storedUser);
                // Atualizamos o estado com o objeto do usuário
                setUser(userObject);
            }
        } catch (error) {
            console.error("AuthContext: Falha ao carregar ou parsear dados do usuário.", error);
            setUser(null);
        } finally {
            // ESSENCIAL: Avisa a aplicação que a verificação inicial terminou.
            setIsLoading(false);
        }
    }, []);

    const logout = () => {
        // A função de logout agora remove as chaves corretas
        localStorage.removeItem('authToken'); // O token que você salva
        localStorage.removeItem('usuario');  // O objeto de usuário que você salva
        setUser(null);
        window.location.href = '/login'; // Redireciona para o login
    };
    
    // Expõe os valores corretos para os componentes
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