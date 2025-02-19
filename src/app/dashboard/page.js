"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useNakama } from "../providers";
import { v4 as uuidv4 } from "uuid";

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [socket, setSocket] = useState(null);
  const [persona, setPersona] = useState("_test_persona"); // Default persona
  const [account, setAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Call getOwner when component mounts
     const client = useNakama();

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const authenticate = async () => {
    try {
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem("deviceId", deviceId);
        const newSession = await client.authenticateDevice(deviceId, true);
        setSession(newSession);
        localStorage.setItem("user_id", newSession.user_id);

        const trace = false;
        const newSocket = client.createSocket(false, trace);
        await newSocket.connect(newSession);
        setSocket(newSocket);

        return newSession;
      } else {
        const session = await client.authenticateDevice(deviceId, true);
        setSession(session);
        localStorage.setItem("user_id", session.user_id);
        const oldSession = await client.linkDevice(session, deviceId);
        setSession(oldSession);

        const trace = false;
        const newSocket = client.createSocket(false, trace);
        await newSocket.connect(oldSession);
        setSocket(newSocket);

        return oldSession;
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    }
  };

  const getOwner = async () => {
    try {
      // Check for valid session
      if (!session) {
        console.log("No active session, authenticating...");
        const newSession = await authenticate();
        setSession(newSession);
        console.log("New session created:", newSession);
      }

      // Check if session needs refresh
      if (session?.refresh_token && session.isexpired()) {
        console.log("Session expired, refreshing...");
        const refreshedSession = await client.sessionRefresh(
          session.refresh_token
        );
        setSession(refreshedSession);
        console.log("Session refreshed:", refreshedSession);
      }

      const ownerData = JSON.parse(localStorage.getItem("ownerData"));
      if (!ownerData || !ownerData.address) {
        throw new Error("No owner data found");
      }
      console.log("Owner data from localStorage:", ownerData);

      const requestPayload = {
        personaTag: ownerData.nickname,
        address: ownerData.address,
      };

      console.log("Request Payload:", requestPayload);
      console.log("Current session:", session);

      const response = await client.rpc(
        session,
        `tx/game/getowner`,
        requestPayload
      );
      console.log("Raw RPC response:", response);

      if (!response.payload) {
        throw new Error("Empty response from server");
      }

      setOwnerInfo(response.payload);
    } catch (error) {
      console.error("Get Owner Error:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      setOwnerInfo(null);

      // Handle session errors
      if (error.message.includes("refresh_token")) {
        console.log("Session invalid, re-authenticating...");
        await authenticate();
      }
    }
  };
  

  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
      if (client) {
          setIsReady(true);
          authenticate();
          getOwner();
        }
      }, [client]);
      
      // authenticate();
      // getOwner();
      const createNewEgg = async () => {
    try {
      const owner = JSON.parse(localStorage.getItem("ownerData"));
      let requestPayload = {
        owner: owner.address,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`, // Add if session token is needed
        },
        body: JSON.stringify(requestPayload),
      };

      const response = await fetch(
        "http://localhost:4040/tx/game/createegg",
        options
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create new egg");
      }

      setNewEgg(data);
      alert("New egg created successfully!");
    } catch (error) {
      console.error("Create New Egg Error:", error);
      alert("Failed to create new egg. Please try again.");
    }
  };

  const [selectedAction, setSelectedAction] = useState(null);
  const [playerProfile, setPlayerProfile] = useState({
    address: "0xA3bC...123F", // Example blockchain address
    nickname: "Metamon",
    joinedAt: new Date(1672531200000).toLocaleDateString(), // Convert UNIX timestamp to readable date
    petCount: 5,
    lastPetTime: new Date(1704067200000).toLocaleString(), // Last pet interaction timestamp
  });
  // Define Gacha Evolution Data (Categorized)
  const gachaEvolution = {
    common: [
      { id: "#C001", name: "Common Dog 1", img: "/gacha/common/dog/1.png" },
      { id: "#C002", name: "Common Dog 2", img: "/gacha/common/dog/2.png" },
      { id: "#C003", name: "Common Dog 3", img: "/gacha/common/dog/3.png" },
      { id: "#C004", name: "Common Neko 1", img: "/gacha/common/neko/1.png" },
      { id: "#C005", name: "Common Neko 2", img: "/gacha/common/neko/2.png" },
      { id: "#C006", name: "Common Neko 3", img: "/gacha/common/neko/3.png" },
      {
        id: "#C007",
        name: "Common Rabbit 1",
        img: "/gacha/common/rabbit/1.png",
      },
      {
        id: "#C008",
        name: "Common Rabbit 2",
        img: "/gacha/common/rabbit/2.png",
      },
      {
        id: "#C009",
        name: "Common Rabbit 3",
        img: "/gacha/common/rabbit/3.png",
      },
    ],
    rare: [
      { id: "#R001", name: "Rare Deer 1", img: "/gacha/rare/deer/1.png" },
      { id: "#R002", name: "Rare Deer 2", img: "/gacha/rare/deer/2.png" },
      { id: "#R003", name: "Rare Deer 3", img: "/gacha/rare/deer/3.png" },
      { id: "#R004", name: "Rare Fox 1", img: "/gacha/rare/fox/1.png" },
      { id: "#R005", name: "Rare Fox 2", img: "/gacha/rare/fox/2.png" },
      { id: "#R006", name: "Rare Fox 3", img: "/gacha/rare/fox/3.png" },
      { id: "#R007", name: "Rare Wolf 1", img: "/gacha/rare/wolf/1.png" },
      { id: "#R008", name: "Rare Wolf 2", img: "/gacha/rare/wolf/2.png" },
      { id: "#R009", name: "Rare Wolf 3", img: "/gacha/rare/wolf/3.png" },
    ],
    epic: [
      { id: "#E001", name: "Epic Dragon 1", img: "/gacha/epic/dragon/1.png" },
      { id: "#E002", name: "Epic Dragon 2", img: "/gacha/epic/dragon/2.png" },
      { id: "#E003", name: "Epic Dragon 3", img: "/gacha/epic/dragon/3.png" },
      { id: "#E004", name: "Epic Griffin 1", img: "/gacha/epic/griffin/1.png" },
      { id: "#E005", name: "Epic Griffin 2", img: "/gacha/epic/griffin/2.png" },
      { id: "#E006", name: "Epic Griffin 3", img: "/gacha/epic/griffin/3.png" },
      { id: "#E007", name: "Epic Phoenix 1", img: "/gacha/epic/phoenix/1.png" },
      { id: "#E008", name: "Epic Phoenix 2", img: "/gacha/epic/phoenix/2.png" },
      { id: "#E009", name: "Epic Phoenix 3", img: "/gacha/epic/phoenix/3.png" },
    ],
    legendary: [
      {
        id: "#L001",
        name: "Legendary Golem 1",
        img: "/gacha/legendary/golem/1.png",
      },
      {
        id: "#L002",
        name: "Legendary Golem 2",
        img: "/gacha/legendary/golem/2.png",
      },
      {
        id: "#L003",
        name: "Legendary Golem 3",
        img: "/gacha/legendary/golem/3.png",
      },
      {
        id: "#L004",
        name: "Legendary Kitsune 1",
        img: "/gacha/legendary/kitsune/1.png",
      },
      {
        id: "#L005",
        name: "Legendary Kitsune 2",
        img: "/gacha/legendary/kitsune/2.png",
      },
      {
        id: "#L006",
        name: "Legendary Kitsune 3",
        img: "/gacha/legendary/kitsune/3.png",
      },
      {
        id: "#L007",
        name: "Legendary Unicorn 1",
        img: "/gacha/legendary/unicorn/1.png",
      },
      {
        id: "#L008",
        name: "Legendary Unicorn 2",
        img: "/gacha/legendary/unicorn/2.png",
      },
      {
        id: "#L009",
        name: "Legendary Unicorn 3",
        img: "/gacha/legendary/unicorn/3.png",
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-[#A8D8EA] to-[#AA96DA]">
      {/* Title Section */}
      <div className="pixel-container relative mb-8">
        <h1 className="font-jersey text-8xl text-center mb-4 kawaii-text-shadow">
          {["D", "A", "S", "H", "B", "O", "A", "R", "D"].map((letter, i) => (
            <span
              key={i}
              className={`inline-block animate-bounce-${i} text-[#FFAAA5]`}>
              {letter}
            </span>
          ))}
        </h1>
        <div className="pixel-decoration"></div>
      </div>

      {/* Player Profile (Tamagotchi Metamon Style) */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-5xl border-8 border-[#A8E6CF] mb-8 w-full">
        <div className="flex items-center space-x-6">
          {/* Player Avatar */}
          <Image
            src="/icons/gacha/legendary/unicorn/3.png"
            alt="Metamon Avatar"
            width={100}
            height={100}
            className="rounded-full"
          />

          {/* Player Info */}
          <div>
            <h2 className="text-2xl font-bold text-[#4b4b4b]">
              {playerProfile.nickname}
            </h2>
            <p className="text-md text-gray-600">
              🏠 Address: {playerProfile.address}
            </p>
            <p className="text-md text-gray-600">
              📅 Joined: {playerProfile.joinedAt}
            </p>
            <p className="text-md text-gray-600">
              🐾 Pets Owned: {playerProfile.petCount}
            </p>
            <p className="text-md text-gray-600">
              ⏳ Last Pet Time: {playerProfile.lastPetTime}
            </p>
          </div>
        </div>

        {/* Connect to Profile Button */}
        <div className="mt-6">
          <button
            className="w-full text-white font-jersey py-3 rounded-xl text-2xl
            shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-[#A8D8EA] to-[#AA96DA] border-2 border-white/30"
            onClick={() => router.push("/profile")}>
            Go to Profile
          </button>
        </div>
      </div>

      {/* Game Console Frame (WIDER) */}
      <div className="relative p-8 kawaii-pattern rounded-3xl shadow-xl max-w-5xl w-full border-8 border-[#A8E6CF]">
        {/* Buttons Inside Wider Game Console Frame */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            className={`w-1/3 text-white font-jersey py-3 rounded-xl text-2xl
            shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white/30 ${
              selectedAction === "newEgg"
                ? "bg-[#FFAAA5] to-[#FFB5B5]"
                : "bg-gradient-to-r from-[#A8D8EA] to-[#AA96DA]"
            }`}
            onClick={() => {
              setSelectedAction("newEgg");
              createNewEgg();
            }}>
            New Egg 🥚
          </button>

          <button
            className={`w-1/3 text-white font-jersey py-3 rounded-xl text-2xl
            shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white/30 ${
              selectedAction === "managePet"
                ? "bg-[#FFAAA5] to-[#FFB5B5]"
                : "bg-gradient-to-r from-[#A8D8EA] to-[#AA96DA]"
            }`}
            onClick={() => setSelectedAction("managePet")}>
            Manage Pet 🐾
          </button>

          <button
            className={`w-1/3 text-white font-jersey py-3 rounded-xl text-2xl
            shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white/30 ${
              selectedAction === "evolutionDictionary"
                ? "bg-[#FFAAA5] to-[#FFB5B5]"
                : "bg-gradient-to-r from-[#A8D8EA] to-[#AA96DA]"
            }`}
            onClick={() => setSelectedAction("evolutionDictionary")}>
            Evolution 📖
          </button>
        </div>
      </div>
      {selectedAction === "newEgg" && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-5xl border-8 border-[#A8E6CF] flex flex-col items-center">
          <h2 className="text-center text-2xl font-bold text-[#FFAAA5] mb-4">
            Hatch a New Egg! 🥚
          </h2>

          <p className="text-center text-gray-600 mb-4">
            Get ready to welcome a new Metamon into your collection!
          </p>

          {/* Egg Image (Before Hatching) */}
          <div className="relative">
            <Image
              src="/gacha/egg/2.png"
              alt="Egg"
              width={150}
              height={150}
              className="transition-transform animate-shake"
            />
          </div>

          {/* Hatch Button (Hardcoded Hatch) */}
          <button
            className="mt-4 bg-[#FFAAA5] text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
            onClick={() => setSelectedAction("hatchedMetamon")}>
            Hatch Now! 🎉
          </button>
        </div>
      )}

      {/* After Clicking Hatch Button - Hardcoded Metamon Appears */}
      {selectedAction === "hatchedMetamon" && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-5xl border-8 border-[#A8E6CF] flex flex-col items-center">
          <h2 className="text-center text-2xl font-bold text-[#FFAAA5] mb-4">
            Congratulations! 🎉
          </h2>

          <p className="text-center text-gray-600 mb-4">
            You have hatched a Rare Metamon! 🌟
          </p>

          {/* Hardcoded Hatched Metamon */}
          <div className="relative">
            <Image
              src="/gacha/rare/fox/1.png"
              alt="Rare Dragon Metamon"
              width={150}
              height={150}
              className="rounded-lg"
            />
          </div>

          {/* Metamon Name Input */}
          <input
            type="text"
            className="mt-4 p-2 border-2 rounded-lg text-center"
            placeholder="Name your Metamon"
            value="Drako"
            readOnly
          />

          <button
            className="mt-4 bg-[#A8D8EA] text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
            onClick={() => setSelectedAction("profile")}>
            Confirm & Go to Profile ✅
          </button>
        </div>
      )}

      {selectedAction === "managePet" && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-5xl border-8 border-[#A8E6CF] flex flex-col items-center">
          <h2 className="text-center text-2xl font-bold text-[#FFAAA5] mb-4">
            Manage Your Metamons 🐾
          </h2>

          <p className="text-center text-gray-600 mb-4">
            Interact, feed, and train your adorable digital companions.
          </p>

          {/* Metamon Profile */}
          <div className="bg-[#fef4f4] rounded-lg p-6 shadow-md border border-[#FFAAA5] w-full">
            <h3 className="text-center text-xl font-bold text-[#AA96DA] mb-4">
              Your Metamon: "Drako"
            </h3>

            <div className="flex items-center space-x-6">
              {/* Metamon Image */}
              <Image
                src="/gacha/rare/fox/1.png"
                alt="Metamon"
                width={150}
                height={150}
              />

              {/* Pet Stats */}
              <div className="flex flex-col space-y-2">
                <p className="text-gray-700">
                  🌟 Evolution Stage: <b>2</b>
                </p>
                <p className="text-gray-700">
                  🍗 Hunger: <b>80/100</b>
                </p>
                <p className="text-gray-700">
                  🎾 Happiness: <b>65/100</b>
                </p>
                <p className="text-gray-700">
                  🛁 Hygiene: <b>50/100</b>
                </p>
                <p className="text-gray-700">
                  ⚡ Energy: <b>90/100</b>
                </p>
              </div>

               {/* See Profile Button */}
              <div className="ml-auto">
                <button
                  className="bg-[#A8D8EA] text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
                  onClick={() => router.push("/profile")}
                >
                  See Profile
                </button>
              </div>
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              className="bg-[#FFAAA5] text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
              onClick={() => router.push("/feedingRoom")}>
              Feed 🍖
            </button>

            <button
              className="bg-[#AA96DA] text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
              onClick={() => interactWithMetamon("play")}>
              Play 🎾
            </button>

            <button
              className="bg-[#A8D8EA] text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
              onClick={() => interactWithMetamon("clean")}>
              Clean 🛁
            </button>
          </div>

          {/* Evolution Progress */}
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-[#AA96DA]">
              Evolution Progress: 1200 / 6000 XP
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-[#FFAAA5] h-4 rounded-full"
                style={{ width: "20%" }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Evolution List (BELOW the Game Console) */}
      {selectedAction === "evolutionDictionary" && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-5xl border-8 border-[#A8E6CF]">
          <h2 className="text-center text-2xl font-bold text-[#FFAAA5] mb-4">
            Evolution List
          </h2>

          {/* Display Each Category */}
          {Object.entries(gachaEvolution).map(([category, pets]) => (
            <div key={category} className="mb-6">
              {/* Category Title */}
              <h3 className="text-xl font-semibold text-center bg-[#fef4f4] rounded-lg p-2 text-[#AA96DA] uppercase shadow-md">
                {category} Pets
              </h3>

              {/* Pets Grid (4 per row) */}
              <div className="grid grid-cols-4 gap-6 mt-4">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="p-4 bg-[#fef4f4] rounded-lg shadow-md border border-[#FFAAA5] flex flex-col items-center text-center">
                    <Image
                      src={pet.img}
                      alt={pet.name}
                      width={100}
                      height={100}
                      className="mb-2"
                    />
                    <span className="font-bold text-lg">{pet.id}</span>
                    <span className="text-[#AA96DA] font-semibold">
                      {pet.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
