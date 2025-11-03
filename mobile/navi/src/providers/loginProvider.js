import React, { createContext, useContext, useState } from "react";

const LoginContext = createContext(null);

function LoginProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <LoginContext.Provider value={{ user, setUser }}>
            {children}
        </LoginContext.Provider>
    );
}

function useLogin() {
    const context = useContext(LoginContext);

    if (!context) {
        throw new Error("useLoginContext must be used within a LoginProvider");
    }

    return context;
};

export { LoginProvider, useLogin };