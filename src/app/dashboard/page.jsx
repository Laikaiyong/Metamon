"use client";

import InteractiveScreen from "@/components/interactive-screen";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useNakama } from "../providers";
import { useRouter } from "next/navigation";
import MemoryCardGame from '@/components/interactive-points'; 

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

  const [purchasedItems, setPurchasedItems] = useState({});
  const [purchasedFood, setPurchasedFood] = useState({});
  const [purchasedWash, setPurchasedWash] = useState({});
  //handle purchasing for item
  const handlePurchase = (itemName, category) => {
    let updatedItems = { ...purchasedItems, [itemName]: (purchasedItems[itemName] || 0) + 1 };
    localStorage.setItem("purchasedItems", JSON.stringify(updatedItems));
    setPurchasedItems(updatedItems);
  
    if (category === "food") {
      let updatedFood = { ...purchasedFood, [itemName]: (purchasedFood[itemName] || 0) + 1 };
      localStorage.setItem("purchasedFood", JSON.stringify(updatedFood));
      setPurchasedFood(updatedFood);
    }
  
    if (category === "wash") {
      let updatedWash = { ...purchasedWash, [itemName]: (purchasedWash[itemName] || 0) + 1 };
      localStorage.setItem("purchasedWash", JSON.stringify(updatedWash));
      setPurchasedWash(updatedWash);
    }
  };
  
  

  const clearPurchasedItems = () => {
    // Clear from localStorage
    localStorage.removeItem("purchasedItems");
    localStorage.removeItem("purchasedFood");
    localStorage.removeItem("purchasedWash");

    // Reset state
    setPurchasedItems({});
    setPurchasedFood({});
    setPurchasedWash({});
  };

  useEffect(() => {
    const storedFood = JSON.parse(localStorage.getItem("purchasedFood")) || {};
    const storedWash = JSON.parse(localStorage.getItem("purchasedWash")) || {};
  
    setPurchasedFood(storedFood);
    setPurchasedWash(storedWash);
  }, []); // Only run once on mount
  

  const nakama = useNakama();

  const getOwner = async () => {
    try {
      const ownerData = JSON.parse(localStorage.getItem("ownerData"));
      if (!ownerData?.address) {
        throw new Error("No owner data found");
      }

      const result = await nakama.getOwner(ownerData.address);


      if (result) {
        setPlayerProfile({
          address: result.payload.owner.address,
          nickname: result.payload.owner.nickname,
          joinedAt: new Date(result.payload.owner.joined_at * 1000).toLocaleDateString(),
          petCount: result.payload.owner.pet_count,
          lastPetTime: result.payload.owner.last_pet_time
            ? new Date(result.payload.owner.last_pet_time * 1000).toLocaleString()
            : "Never",
          balance: result.payload.owner.balance, // Add this line to include balance
        });
      }
    } catch (error) {
      console.error("Get Owner Error:", error);
      setPlayerProfile(null);
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      try {
        await nakama.authenticate();
        const result = await getOwner();
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
      }
    };

    initDashboard();
  }, []);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to redirect users to Uniswap
  const handleUniswapSwap = () => {
    const baseUrl = "https://app.uniswap.org/#/swap";
    const tokenFrom = "USDC"; // Default swap from USDC
    const tokenTo = ""; // Users will select manually

    const swapUrl = `${baseUrl}?inputCurrency=${tokenFrom}&outputCurrency=${tokenTo}`;
    window.open(swapUrl, "_blank");
  };

  return (
    <>
      {/* Wrapper */}
      <div className="flex min-h-screen bg-gradient-to-b from-[#A8D8EA] to-[#AA96DA]">
        {/* Center Container */}
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 px-6">
          {/* Left Column - Map */}
          <div className="order-2 w-full lg:order-1">
            <InteractiveScreen
              currentScreen={currentScreen}
              setCurrentScreen={setCurrentScreen}
              onPurchase={handlePurchase}
            />
          </div>

          {/* Right Column - Profile & Stats Cards */}
          <div className="w-full flex flex-col gap-6 order-1 lg:order-2">
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
                {/* User Profile and Details */}
                <div>
                  <h2 className="text-2xl font-bold text-[#4b4b4b]">
                    {playerProfile.nickname || "Unknown"}
                  </h2>
                  <p className="text-md text-gray-600">
                    🏠 Address: {truncateAddress(playerProfile.address)}
                  </p>
                  <p className="text-md text-gray-600">
                    💰 Balance: {playerProfile.balance}
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
              {currentScreen === "openMap" && (
                <div>
                  
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
              )}
              {currentScreen === "shop" && (
                <div>
                  <h2 className="text-2xl font-bold text-[#4b4b4b] mb-4 text-center">
                    Your MetaItem 🛍️
                  </h2>

                  {/* Delete this ltr */}
                  <button
                    onClick={clearPurchasedItems}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Clear Purchased Items
                  </button>

                  {Object.keys(purchasedItems).length === 0 ? (
                    <p className="text-center text-gray-600">
                      You haven't purchased any items yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-6 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[350px] overflow-y-auto">
                      {Object.entries(purchasedItems).map(
                        ([itemName, quantity], index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md"
                          >
                            <Image
                              src={`/shop/${itemName.toLowerCase()}.png`}
                              alt={itemName}
                              width={80}
                              height={80}
                            />
                            <p className="text-[#5D4037] text-lg font-semibold mt-2">
                              {itemName} x{quantity}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
              {currentScreen === "kitchen" && (
                <div>
                  <h2 className="text-xl font-bold text-[#4b4b4b]">
                    🍳 My Kitchen
                  </h2>
                  <p className="mt-2 text-gray-600">
                    You have the following ingredients:
                  </p>
                  <ul className="mt-4 space-y-2">
                    {Object.keys(purchasedFood).length > 0 ? (
                      Object.entries(purchasedFood).map(
                        ([foodName, quantity], index) => (
                          <li
                            key={index}
                            className="p-3 bg-[#F4F4F4] rounded-md"
                          >
                            {foodName} x{quantity}
                          </li>
                        ),
                      )
                    ) : (
                      <p className="text-gray-500">
                        Your kitchen is empty. Buy some food!
                      </p>
                    )}
                  </ul>
                </div>
              )}
              {currentScreen === "bathroom" && (
                <div>
                  <h2 className="text-xl font-bold text-[#4b4b4b]">
                    🚽 My Bathroom
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Check your Metamon Hygiene status:
                  </p>
                  <ul className="mt-4 space-y-2">
                    {Object.keys(purchasedWash).length > 0 ? (
                      Object.entries(purchasedWash).map(
                        ([washItem, quantity], index) => (
                          <li
                            key={index}
                            className="p-3 bg-[#F4F4F4] rounded-md"
                          >
                            {washItem} x{quantity}
                          </li>
                        ),
                      )
                    ) : (
                      <p className="text-gray-500">
                        Your bathroom is empty. Buy some wash items!
                      </p>
                    )}
                  </ul>
                </div>
              )}

              {currentScreen === "gameRoom" && (
                <div>
                  <h2 className="text-xl font-bold text-[#4b4b4b]">
                    🎮 Game Room
                  </h2>
                  <p className="mt-2 text-gray-600">Your available games:</p>
                
                  <ul className="mt-4 space-y-2">
                    <li className="p-3 bg-[#F4F4F4] rounded-md">
                      Memory Game 🧩{" "}                      
                    </li>
                    <li className="p-3 bg-[#F4F4F4] rounded-md">
                      Test your reaction speed 🏎️
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
