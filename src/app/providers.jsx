'use client';

import { Client, Session, Socket } from "@heroiclabs/nakama-js";
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

class GameState {
    playerIndex = 0;
    ownerData = null;
    personaTag = null;
}
class Nakama {
    client;
    session = null;
    socket = null;
    gameState = new GameState();

    constructor() {
        this.client = new Client(
            "defaultkey",
            process.env.NEXT_PUBLIC_SERVER_API || "localhost",
            process.env.NEXT_PUBLIC_SERVER_PORT || "7350"
        );
    }

    async createPersona() {
        if (!this.session) throw new Error("No active session");
        
        try {
            const personaId = Math.random().toString(36).substring(2, 10);
            const response = await this.client.rpc(
                this.session,
                "nakama/claim-persona",
                {
                    personaTag: personaId,
                    metadata: {
                        version: "1.0",
                        type: "player"
                    }
                }
            );
            
            this.gameState.personaTag = personaId;
            localStorage.setItem("personaTag", personaId);
            return response.payload;
        } catch (error) {
            console.error("Create Persona Error:", error);
            throw error;
        }
    }

    async authenticate() {
        let retries = 3;
        
        while (retries > 0) {
            try {
                console.log(`Authentication attempt ${4 - retries}/3`);
                
                let deviceId = localStorage.getItem("deviceId");
                if (!deviceId) {
                    deviceId = uuidv4();
                    localStorage.setItem("deviceId", deviceId);
                }
                
                // Validate deviceId format
                if (!deviceId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
                    console.log("Invalid deviceId format, generating new one");
                    deviceId = uuidv4();
                    localStorage.setItem("deviceId", deviceId);
                }
    
                this.session = await this.client.authenticateDevice(deviceId, true);
    
                if (!this.session?.token) {
                    throw new Error("Session creation failed");
                }
    
                localStorage.setItem("user_id", this.session.user_id);
                console.log("Session created successfully");
    
                const trace = false;
                this.socket = this.client.createSocket(false, trace);
                
                // Add timeout for socket connection
                const socketPromise = this.socket.connect(this.session, true);
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Socket connection timeout")), 5000)
                );
                
                await Promise.race([socketPromise, timeoutPromise]);
                console.log("Socket connected successfully");

                let personaTag = localStorage.getItem("personaTag");
                if (!personaTag) {
                    const persona = await this.createPersona();
                } else {
                    this.gameState.personaTag = personaTag;
                }
                
                return this.session;
    
            } catch (error) {
                console.error(`Authentication attempt failed (${4 - retries}/3):`, error);
                retries--;
                
                if (retries === 0) {
                    throw new Error(`Authentication failed after 3 attempts: ${error.message}`);
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    
    // Transactions (Messages)
    async createOwner(payload) {
        if (!this.session) throw new Error("No active session");
        if (!this.gameState.personaTag) throw new Error("No persona tag found");
    
        try {
            const response = await this.client.rpc(
                this.session,
                "tx/game/createowner",
                {
                    ...payload,
                    personaTag: this.gameState.personaTag,
                    namespace: "metamon",
                    metadata: {
                        ...payload.metadata,
                        version: "1.0"
                    }
                }
            );
            this.gameState.ownerData = response.payload;
            return response;
        } catch (error) {
            console.error("CreateOwner RPC failed:", error);
            throw error;
        }
    }

    async carePet(petId) {
        if (!this.session) throw new Error("No active session");
        return await this.client.rpc(
            this.session,
            "tx/game/carepet",
            { personaTag: this.gameState.personaTag, petId }
        );
    }

    async evolvePet(petId) {
        if (!this.session) throw new Error("No active session");
        return await this.client.rpc(
            this.session,
            "tx/game/evolvepet",
            { personaTag: this.gameState.personaTag, petId }
        );
    }

    async createEgg(ownerAddress, tier) {
        if (!this.session) throw new Error("No active session");
        return await this.client.rpc(
            this.session,
            "tx/game/createegg",
            { personaTag: this.gameState.personaTag, owner: ownerAddress, tier }
        );
    }
    
    async purchaseItem(itemId) {
        if (!this.session) throw new Error("No active session");
        return await this.client.rpc(
            this.session,
            "tx/game/purchaseitem",
            { personaTag: this.gameState.personaTag, itemId }
        );
    }

    async consumeItem(itemId, targetId) {
        if (!this.session) throw new Error("No active session");
        return await this.client.rpc(
            this.session,
            "tx/game/consumeitem",
            { personaTag: this.gameState.personaTag, itemId, targetId }
        );
    }

    // Queries
    async getPetInfo(petId) {
        if (!this.session) throw new Error("No active session");
        return await this.client.rpc(
            this.session,
            "query/game/petinfo",
            { personaTag: this.gameState.personaTag, petId }
        );
    }

    async getOwner(address) {
        if (!this.session) throw new Error("No active session");
        return await this.client.rpc(
            this.session,
            "query/game/ownerinfo",
            { personaTag: this.gameState.personaTag, address }
        );
    }

    async getOwnerPets(owner) {
        if (!this.session) throw new Error("No active session");
        return await this.client.rpc(
            this.session,
            "query/game/ownerpets",
            { personaTag: this.gameState.personaTag, owner }
        );
    }

    async getOwnerItems(owner) {
        if (!this.session) throw new Error("No active session");
        return await this.client.rpc(
            this.session,
            "query/game/owneritems",
            { personaTag: this.gameState.personaTag, owner }
        );
    }
}

const NakamaContext = createContext(null);

export function Providers({ children }) {
    const [nakamaInstance, setNakamaInstance] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const instance = new Nakama();
        setNakamaInstance(instance);
        setIsInitialized(true);
    }, []);

    if (!isInitialized) {
        return (
            <NakamaContext.Provider value={new Nakama()}>
            {children}
        </NakamaContext.Provider>
        )
    }

    return (
        <NakamaContext.Provider value={nakamaInstance}>
            {children}
        </NakamaContext.Provider>
    );
}

export function useNakama() {
    const context = useContext(NakamaContext);
    if (!context) {
        throw new Error('useNakama must be used within a NakamaProvider');
    }
    return context;
}