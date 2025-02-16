'use client';

import { Client } from "@heroiclabs/nakama-js";
import { createContext, useContext, useState, useEffect } from "react";

// Create contexts
export const NakamaContext = createContext(null);

// Create provider component
export function Providers({ children }) {
    const [client, setClient] = useState(null);

    useEffect(() => {
        // Initialize Nakama client
        const nakamaClient = new Client(
            "defaultkey",           // API key
            "localhost",           // host
            "7350",               // port
        );

        setClient(nakamaClient);
    }, []);

    return (
        <NakamaContext.Provider value={client}>
            {children}
        </NakamaContext.Provider>
    );
}

// Custom hook for using Nakama client
export const useNakama = () => {
    const context = useContext(NakamaContext);
    if (context === undefined) {
        throw new Error('useNakama must be used within a NakamaProvider');
    }
    return context;
};