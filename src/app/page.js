"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNakama } from "./providers";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nakama = useNakama();
  const router = useRouter();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const connectToMetaMask = async () => {
    try {
      if (!window.ethereum) {
        alert(
          "MetaMask is not installed. Please install it to use this feature."
        );
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      console.log("Connected to MetaMask:", accounts[0]);

      await nakama.authenticate();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const disconnectMetaMask = () => {
    setAccount(null);
    setShowModal(false);
  };

  const createOwner = async () => {
    if (!nickname.trim()) {
      alert("Please enter a nickname.");
      return;
    }

    setIsLoading(true);

    try {
      const requestPayload = {
        namespace: "metamon",
        timestamp: Date.now(),
        signature: account,
        nickname: nickname,
        address: account,
        metadata: {
          // Added metadata
          type: "player",
          version: "1.0",
        },
      };

      const response = await nakama.createOwner(requestPayload);
      console.log(response);

      const storageData = {
        ...requestPayload,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("ownerData", JSON.stringify(storageData));

      router.push("/dashboard");
    } catch (error) {
      console.error("Create Owner Error:", error);
      alert("Failed to create owner. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#A8D8EA] to-[#AA96DA]">
      <div className="container mx-auto flex items-center justify-center gap-6 px-6">
        {/* Left Column - Main Content */}
        <div className="w-[800px]">
          <div className="p-8 bg-white rounded-lg shadow-lg border-8 border-[#A8E6CF]">
            {/* Title Section */}
            <div className="pixel-container relative mb-8">
              <h1 className="font-jersey text-8xl text-center mb-4 kawaii-text-shadow">
                {["M", "E", "T", "A", "M", "O", "N"].map((letter, i) => (
                  <span
                    key={i}
                    className={`inline-block animate-bounce-${i} text-[#FFAAA5]`}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
            </div>

            {/* Game Console Frame */}
            <div className="game-screen-frame rounded-2xl p-4 mb-6">
              <div className="w-48 h-48 mx-auto relative screen-background rounded-2xl p-2 border-kawaii">
                <Image
                  src="/gif.gif"
                  alt="Metamon Logo"
                  width={192}
                  height={192}
                  className="pixel-art-screen"
                  priority
                />
              </div>
            </div>

            {/* Connection Controls */}
            <div className="w-full flex flex-col items-center space-y-4">
              <button
                onClick={connectToMetaMask}
                className="w-4/5 bg-gradient-to-r from-[#FFAAA5] to-[#FFB5B5] text-white font-jersey py-3 rounded-xl text-3xl"
              >
                {account ? `${truncateAddress(account)}` : "Connect Wallet ✨"}
              </button>

              {account && (
                <button
                  onClick={disconnectMetaMask}
                  className="w-4/5 bg-gradient-to-r from-[#AA96DA] to-[#A8D8EA] text-white font-jersey py-3 text-3xl rounded-xl"
                >
                  Disconnect 🌟
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Navigation */}
        <div className="w-[400px] flex flex-col gap-6">
          <div className="p-4 bg-white rounded-lg shadow-lg border-8 border-[#A8E6CF]">
            <nav className="flex flex-col space-y-4">
              {!account ? (
                <>
                  <button
                    disabled
                    className="flex items-center space-x-4 w-full p-3 bg-gray-100 rounded-lg"
                  >
                    <span className="text-2xl">👤</span>
                    <span className="text-lg font-semibold text-gray-400">
                      Connect Wallet First
                    </span>
                  </button>
                  <button
                    disabled
                    className="flex items-center space-x-4 w-full p-3 bg-gray-100 rounded-lg"
                  >
                    <span className="text-2xl">🎮</span>
                    <span className="text-lg font-semibold text-gray-400">
                      Start Game
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-[#F9F5EB] rounded-lg">
                    <h3 className="font-bold mb-2">Wallet Info</h3>
                    <p className="text-sm text-gray-600">
                      Address: {truncateAddress(account)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const existingOwnerData = localStorage.getItem("ownerData");
                      if (existingOwnerData) {
                        router.push("/full");
                        return;
                      }
                
                      setShowModal(true);
                    }}
                    className="flex items-center space-x-4 w-full p-3 bg-[#FFAAA5] hover:bg-[#FFB5B5] rounded-lg text-white transition-colors"
                  >
                    <span className="text-2xl">🎮</span>
                    <span className="text-lg font-semibold">Play Game</span>
                  </button>
                  <button
                    onClick={() => router.push("/wiki")}
                    className="flex items-center space-x-4 w-full p-3 bg-[#A8D8EA] hover:bg-[#AA96DA] rounded-lg text-white transition-colors"
                  >
                    <span className="text-2xl">❔</span>
                    <span className="text-lg font-semibold">Wiki</span>
                  </button>
                </>
              )}
            </nav>
          </div>
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
            shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Character ✨"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
