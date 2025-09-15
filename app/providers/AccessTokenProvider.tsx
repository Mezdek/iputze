'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AccessTokenContextType {
    accessToken: string | null;
    setAccessToken: (accessToken: string | null) => void;
}

const AccessTokenContext = createContext<AccessTokenContextType | undefined>(undefined);


export const AccessTokenProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("accessToken");
        if (saved) setToken(saved);
    }, []);

    const setAccessToken = (newToken: string | null) => {
        newToken ? localStorage.setItem("accessToken", newToken) : localStorage.removeItem("accessToken");
        setToken(newToken);
    };

    return (
        <AccessTokenContext.Provider value={{ accessToken: token, setAccessToken }}>
            {children}
        </AccessTokenContext.Provider>
    );
};


export const useAccessToken = (): AccessTokenContextType => {
    const ctx = useContext(AccessTokenContext);
    if (!ctx) throw new Error("useAccessToken must be used within AccessTokenProvider");
    return ctx;
};




