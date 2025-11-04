"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        try {
           
            const storedUser = localStorage.getItem('usuario');
            
           
            if (storedUser) {
                const userObject = JSON.parse(storedUser);
                setUser(userObject);
            }
        } catch (error) {
            console.error("AuthContext: Falha ao carregar ou parsear dados do usuário.", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = () => {
       
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');  
        setUser(null);
        window.location.href = '/'; //ARRUMAR LINK PARA  APAGINA Q TIVER OS TRECO DE BOTÃO
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