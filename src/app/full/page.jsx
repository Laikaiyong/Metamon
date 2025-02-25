"use client";

import InteractiveScreen from "@/components/interactive-screen";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useNakama } from "../providers";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState("openMap");
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [persona, setPersona] = useState("_test_persona"); // Default persona
  const [account, setAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [playerProfile, setPlayerProfile] = useState({
    address: "0xA3bC...123F", // Example blockchain address
    nickname: "Metamon",
    joinedAt: new Date(1672531200000).toLocaleDateString(), // Convert UNIX timestamp to readable date
    petCount: 5,
    lastPetTime: new Date(1704067200000).toLocaleString(), // Last pet interaction timestamp
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const [isReady, setIsReady] = useState(false);

  const [pets, setPets] = useState([]);

  const loadPets = async () => {
    try {
      const ownerData = JSON.parse(localStorage.getItem("ownerData"));
      if (!ownerData?.address) return;

      const petIds = await nakama.getOwnerPets(ownerData.address);
      console.log("Pet IDs:", petIds); // Debug log
      // setPets(petIds);
    } catch (error) {
      console.error("Load Pets Error:", error);
    }
  };

  const nakama = useNakama();

  const getOwner = async () => {
    try {
      const ownerData = JSON.parse(localStorage.getItem("ownerData"));
      if (!ownerData?.address) {
        throw new Error("No owner data found");
      }

      const owner = await nakama.getOwner(ownerData.address);

      console.log("Owner ", owner);
      if (owner) {
        setPlayerProfile({
          address: owner.address,
          nickname: owner.nickname,
          joinedAt: new Date(owner.joined_at * 1000).toLocaleDateString(),
          petCount: owner.pet_count,
          lastPetTime: owner.last_pet_time
            ? new Date(owner.last_pet_time * 1000).toLocaleString()
            : "Never",
        });
      }
    } catch (error) {
      console.error("Get Owner Error:", error);
      setPlayerProfile(null);
    }
  };

  const createNewEgg = async () => {
    try {
      setIsLoading(true);
      await nakama.authenticate();
      const owner = JSON.parse(localStorage.getItem("ownerData"));
      const tier = Math.floor(Math.random() * 4) + 1;
      const tierToCategory = {
        1: "common",
        2: "rare",
        3: "epic",
        4: "legendary",
      };
      const category = tierToCategory[tier];
      const response = await nakama.createEgg(owner.address, category);
      console.log("New egg created:", response);
      alert("New egg created successfully!");
    } catch (error) {
      console.error("Create New Egg Error:", error);
      alert("Failed to create new egg. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      try {
        await nakama.authenticate();
        await getOwner();
        await loadPets();
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
      }
    };

    initDashboard();
  }, []);

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Food items list
  const foodItems = [
    { name: "Apple", image: "/shop/apple.png", price: 50 },
    { name: "Carrot", image: "/shop/carrot.png", price: 30 },
    { name: "Broccoli", image: "/shop/broccoli.png", price: 20 },
    { name: "Banana", image: "/shop/banana.png", price: 40 },
    { name: "Grapes", image: "/shop/grape.png", price: 60 },
    { name: "Orange", image: "/shop/orange.png", price: 35 },
    { name: "Strawberry", image: "/shop/strawberry.png", price: 45 },
    { name: "Watermelon", image: "/shop/watermelon.png", price: 70 },
  ];

  return (
    <>
      {/* Wrapper */}
      <div className="flex min-h-screen bg-gradient-to-b from-[#A8D8EA] to-[#AA96DA]">
        {/* Center Container */}
        <div className="container mx-auto flex items-center justify-center gap-6 px-6">
          {/* Left Column - Map */}
          <div className="w-full">
            <InteractiveScreen
              currentScreen={currentScreen}
              setCurrentScreen={setCurrentScreen}
            />
          </div>

          {/* Middle Column (diff screen diff stuff) */}
          {/* If setCurrentScreen("shop") then if will see my purchased shop List */}
          {/* Middle Column - Different Screens Based on Selection */}
    <div className="w-full p-6 bg-white rounded-lg shadow-lg border-8 border-[#A8E6CF] h-[600px] overflow-y-auto">

    {currentScreen === "shop" && (
    <div>
      <h2 className="text-2xl font-bold text-[#4b4b4b] mb-4 text-center">Your MetaItem </h2>

      {/* Food Items Grid */}
      <div className="grid grid-cols-2 gap-6 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[350px] overflow-y-auto">
        {foodItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md transition-transform hover:scale-105"
          >
            <Image src={item.image} alt={item.name} width={80} height={80} />
            <p className="text-[#5D4037] text-lg font-semibold mt-2">{item.name}</p>
            <div className="flex items-center space-x-3 mt-2">
              <span className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md text-sm">{item.price} 🪙</span>
              <button className="bg-[#FFAAA5] text-white px-3 py-1 rounded-lg shadow-md hover:scale-110 transition-transform">
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

      {currentScreen === "kitchen" && (
        <div>
          <h2 className="text-xl font-bold text-[#4b4b4b]">🍳 My Kitchen</h2>
          <p className="mt-2 text-gray-600">You have the following ingredients:</p>
          <ul className="mt-4 space-y-2">
            <li className="p-3 bg-[#F4F4F4] rounded-md">Eggs 🥚</li>
            <li className="p-3 bg-[#F4F4F4] rounded-md">Milk 🥛</li>
            <li className="p-3 bg-[#F4F4F4] rounded-md">Flour 🌾</li>
          </ul>
        </div>
      )}

      {currentScreen === "bathroom" && (
        <div>
          <h2 className="text-xl font-bold text-[#4b4b4b]">🚽 My Bathroom</h2>
          <p className="mt-2 text-gray-600">Check your bathroom status:</p>
          <ul className="mt-4 space-y-2">
            <li className="p-3 bg-[#F4F4F4] rounded-md">Soap: Full 🧼</li>
            <li className="p-3 bg-[#F4F4F4] rounded-md">Shampoo: Half Left 🛁</li>
            <li className="p-3 bg-[#F4F4F4] rounded-md">Toothpaste: New Tube! 🦷</li>
          </ul>
        </div>
      )}

      {currentScreen === "gameRoom" && (
        <div>
          <h2 className="text-xl font-bold text-[#4b4b4b]">🎮 Game Room</h2>
          <p className="mt-2 text-gray-600">Your available games:</p>
          <ul className="mt-4 space-y-2">
            <li className="p-3 bg-[#F4F4F4] rounded-md">Retro Racing 🏎️</li>
            <li className="p-3 bg-[#F4F4F4] rounded-md">Puzzle Kingdom 🧩</li>
            <li className="p-3 bg-[#F4F4F4] rounded-md">Battle Arena ⚔️</li>
          </ul>
        </div>
      )}
    </div>

          {/* Right Column - Profile & Stats Cards */}
          <div className="w-full flex flex-col gap-6">
            {/* Top Profile Card */}
            <div className="p-4 bg-white rounded-lg shadow-lg border-8 border-[#A8E6CF]">
              <div className="flex items-center space-x-6">
                <Image
                  src="https://pbs.twimg.com/profile_images/1522047602702880769/rUanH7Tv_400x400.jpg"
                  alt="Metamon Avatar"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold text-[#4b4b4b]">
                    {playerProfile.nickname}
                  </h2>
                  <p className="text-md text-gray-600">
                    🏠 Address: {truncateAddress(playerProfile.address)}
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
            </div>

            {/* Bottom Stats Card */}
            <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-lg border-8 border-[#A8E6CF]">
              <button
                onClick={() => setCurrentScreen("shop")}
                className="flex items-center space-x-4 w-full p-3 hover:bg-[#A8E6CF] rounded-lg transition-all"
              >
                <span className="text-2xl">🏪</span>
                <span className="text-lg font-semibold text-[#4b4b4b]">
                  Shop
                </span>
              </button>

              <button
                onClick={() => setCurrentScreen("kitchen")}
                className="flex items-center space-x-4 w-full p-3 hover:bg-[#A8E6CF] rounded-lg transition-all"
              >
                <span className="text-2xl">🍳</span>
                <span className="text-lg font-semibold text-[#4b4b4b]">
                  Kitchen
                </span>
              </button>

              <button
                onClick={() => setCurrentScreen("bathroom")}
                className="flex items-center space-x-4 w-full p-3 hover:bg-[#A8E6CF] rounded-lg transition-all"
              >
                <span className="text-2xl">🚽</span>
                <span className="text-lg font-semibold text-[#4b4b4b]">
                  Bathroom
                </span>
              </button>

              <button
                onClick={() => setCurrentScreen("gameRoom")}
                className="flex items-center space-x-4 w-full p-3 hover:bg-[#A8E6CF] rounded-lg transition-all"
              >
                <span className="text-2xl">🎮</span>
                <span className="text-lg font-semibold text-[#4b4b4b]">
                  Game Room
                </span>
              </button>

              <button
                onClick={() => router.push("/wiki")}
                className="flex items-center space-x-4 w-full p-3 hover:bg-[#A8E6CF] rounded-lg transition-all"
              >
                <span className="text-2xl">📚</span>
                <span className="text-lg font-semibold text-[#4b4b4b]">
                  Wiki
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
