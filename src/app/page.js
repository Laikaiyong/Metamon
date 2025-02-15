"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNakama } from "./providers";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [persona, setPersona] = useState("_test_persona"); // Default persona
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);

  const client = useNakama();
  const router = useRouter();

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log("Connected to MetaMask:", accounts[0]);

        // Show modal after successful connection
        setShowModal(true);
      } catch (error) {
        console.error("Failed to connect to MetaMask", error);
      }
    } else {
      alert(
        "MetaMask is not installed. Please install it to use this feature."
      );
    }
  };

  const disconnectMetaMask = () => {
    setAccount(null);
    setShowModal(false);
    console.log("Disconnected from MetaMask");
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const authenticate = async () => {
    try {
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem("deviceId", deviceId);
      }

      const newSession = await client.authenticateDevice(deviceId, true);
      setSession(newSession);
      localStorage.setItem("user_id", newSession.user_id);

      const trace = false;
      const newSocket = client.createSocket(false, trace);
      await newSocket.connect(newSession);
      setSocket(newSocket);

      return newSession;
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    }
  };

  const createOwner = async () => {
    if (!nickname.trim()) {
      alert("Please enter a nickname.");
      return;
    }

    setIsLoading(true);
    try {
      // Create request payload
      const requestPayload = {
        personaTag: persona,
        namespace: "metamon",
        timestamp: Date.now(),
        signature: account, // Using wallet address as signature
        body: {
          nickname: nickname,
          address: account,
          persona_type: persona,
        },
      };

      console.log("Request Payload:", requestPayload);

      // API call options
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`, // Add if session token is needed
        },
        body: JSON.stringify(requestPayload),
      };

      console.log(
        "Sending request to:",
        "http://localhost:4040/tx/game/createowner"
      );

      const response = await fetch(
        "http://localhost:4040/tx/game/createowner",
        options
      );
      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create owner");
      }

      // Save to localStorage
      const storageData = {
        ...requestPayload.body,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("ownerData", JSON.stringify(storageData));
      console.log("Data saved to localStorage");

      console.log("Owner created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Create Owner Error:", {
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      alert("Failed to create owner. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-[#A8D8EA] to-[#AA96DA]">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://64.media.tumblr.com/2a147549f69f13da935aec570f2c2c1e/91cbac430d1b6d34-e0/s400x600/48c771b5a32f873b165b64aafea8ea613c5e9ff9.png"
          alt="Fantasy Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.4)]"></div>
      </div>

      {/* Title Section */}
      <div className="pixel-container relative mb-8">
        <h1 className="font-jersey text-8xl text-center mb-4 kawaii-text-shadow">
          {["M", "E", "T", "A", "M", "O", "N"].map((letter, i) => (
            <span
              key={i}
              className={`inline-block animate-bounce-${i} text-[#FFAAA5]`}>
              {letter}
            </span>
          ))}
        </h1>
        <div className="pixel-decoration"></div>
      </div>

      {/* Game Console Frame */}
      <div className="relative p-8 kawaii-pattern rounded-3xl shadow-xl max-w-md w-full border-8 border-[#A8E6CF] transform rotate-1">
        {/* Screen Frame with Texture */}
        <div className="game-screen-frame rounded-2xl p-4 mb-6">
          {/* Game Screen */}
          <div className="w-48 h-48 mx-auto relative screen-background rounded-2xl p-2 border-kawaii">
            <Image
              src="/gif.gif"
              alt="Metamon Logo"
              width={192}
              height={192}
              className="pixel-art-screen"
              priority
            />
            <div className="screen-stars"></div>
            <div className="screen-sparkle"></div>
          </div>
        </div>

        {/* Connection Controls */}
        <div className="w-full flex flex-col items-center space-y-4">
          <button
            onClick={connectToMetaMask}
            className="w-4/5 bg-gradient-to-r from-[#FFAAA5] to-[#FFB5B5] text-white font-jersey py-3 rounded-xl text-3xl 
            shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white/30">
            {account ? `${truncateAddress(account)}` : "Connect Wallet ✨"}
          </button>

          {account && (
            <button
              onClick={disconnectMetaMask}
              className="w-4/5 bg-gradient-to-r from-[#AA96DA] to-[#A8D8EA] text-white font-jersey py-3 text-3xl
              rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white/30">
              Disconnect 🌟
            </button>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#eadccf] p-6 rounded-lg shadow-lg w-96 text-center border-8 border-double border-[#4a3728]">
            <h2 className="text-xl font-bold mb-4 text-black">
              Create Your Character
            </h2>

            {/* Wallet Display */}
            <p className="text-gray-600 mb-2">Wallet Address:</p>
            <p className="font-mono text-sm text-blue-600 bg-gray-200 p-2 rounded-md mb-4">
              {truncateAddress(account)}
            </p>

            {/* Nickname Input */}
            <input
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-3 border border-gray-400 rounded-md mb-4 text-black"
            />

            {/* Create Button */}
            <button
              onClick={createOwner}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FFAAA5] to-[#FFB5B5] text-white font-bold py-3 rounded-xl
            shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50">
              {isLoading ? "Creating..." : "Create Character ✨"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
