'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AccessTokenContextType {
    accessToken: string | null;
    setAccessToken: (accessToken: string | null) => void;
    initialized: boolean;
}

const AccessTokenContext = createContext<AccessTokenContextType | undefined>(undefined);
const ACCESS_TOKEN_NAME = "accessToken";

export const AccessTokenProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);

    useEffect(() => {
        const saved = localStorage.getItem(ACCESS_TOKEN_NAME);
        if (saved) setToken(saved);
        setInitialized(true)
    }, []);

    const setAccessToken = (newToken: string | null) => {
        newToken ? localStorage.setItem(ACCESS_TOKEN_NAME, newToken) : localStorage.removeItem(ACCESS_TOKEN_NAME);
        setToken(newToken);
    };
    return (
        <AccessTokenContext.Provider value={{ accessToken: token, setAccessToken, initialized }}>
            {children}
        </AccessTokenContext.Provider>
    );
};


export const useAccessToken = (): AccessTokenContextType => {
    const ctx = useContext(AccessTokenContext);
    if (!ctx) throw new Error("useAccessToken must be used within AccessTokenProvider");
    return ctx;
};




