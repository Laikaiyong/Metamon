"use client";

import InteractiveScreen from "@/components/interactive-screen";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useNakama } from "../providers";
import { useRouter } from "next/navigation";
import MemoryCardGame from "@/components/interactive-points";

const MetaSwapModal = ({ onClose, onSwap }) => {
  const [usdcAmount, setUsdcAmount] = useState("");
  const [metaTokenAmount, setMetaTokenAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const nakama = useNakama();

  const handleSwap = async () => {
    if (!usdcAmount || isSwapping) return;

    try {
      setIsSwapping(true);
      await nakama.authenticate();
      await nakama.updateBalance(Number(metaTokenAmount));
      await onSwap();
      
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Failed to swap tokens. Please try again.");
    } finally {
      setIsSwapping(false);
    }
  };

  const handleUSDCInput = (e) => {
    const amount = e.target.value;
    setUsdcAmount(amount);
    setMetaTokenAmount(amount ? (amount * 15).toFixed(2) : "");
  };

  const handleGetOwnerItems = async () => {
    try {
      await nakama.authenticate();

      const owner = JSON.parse(localStorage.getItem("ownerData"));
      if (!owner?.address) return;

      const response = await nakama.getOwnerItems(owner.address);
      if (response?.payload?.items) {
        const items = response.payload.items;
        const foodItems = items.filter((item) => item.type === "food");
        const washItems = items.filter((item) => item.type === "wash");

        setPurchasedFood(foodItems);
        setPurchasedWash(washItems);
      }
    } catch (error) {
      console.error("Failed to fetch owner items:", error);
    }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-[#FDF6E3] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#5D4037] mb-6 text-center">
          MetaSwap 💱
        </h2>

        <div className="bg-[#FAF3E0] p-6 rounded-lg shadow-inner">
          {/* From USDC */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[#5D4037] font-semibold">From</p>
              <div className="flex items-center space-x-2 bg-[#FAF3E0] px-3 py-1 rounded-lg">
                <Image
                  src="/uniswap/usdc.png"
                  alt="USDC"
                  width={24}
                  height={24}
                />
                <span className="text-[#5D4037] font-semibold">USDC</span>
              </div>
            </div>
            <input
              type="number"
              value={usdcAmount}
              onChange={handleUSDCInput}
              className="w-full bg-transparent text-2xl font-bold text-[#5D4037] focus:outline-none"
              placeholder="0.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              ${usdcAmount || "0.00"}
            </p>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-[#D4B483] p-2 rounded-full shadow-md hover:scale-110 transition-transform">
              <span className="text-white text-xl">⇅</span>
            </div>
          </div>

          {/* To Metatoken */}
          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[#5D4037] font-semibold">To</p>
              <div className="flex items-center space-x-2 bg-[#FAF3E0] px-3 py-1 rounded-lg">
                <Image
                  src="/uniswap/Metatoken.webp"
                  alt="Metatoken"
                  width={24}
                  height={24}
                />
                <span className="text-[#5D4037] font-semibold">META</span>
              </div>
            </div>
            <input
              type="number"
              value={metaTokenAmount}
              className="w-full bg-transparent text-2xl font-bold text-[#5D4037]"
              disabled
              placeholder="0.00"
            />
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!usdcAmount || isSwapping}
            className={`w-full mt-6 ${
              !usdcAmount || isSwapping
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FFAAA5] hover:bg-[#FF9A95]"
            } text-white font-bold py-3 rounded-lg shadow-md transition-colors`}>
            {isSwapping ? "Swapping..." : "Swap"}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-[#D4B483] hover:bg-[#C4A473] text-white font-bold py-2 rounded-lg shadow-md transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}};

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
  const [itemInventory, setItemInventory] = useState({
    food: [],
    wash: [],
    game: [],
  });
  const [inventoryLoading, setInventoryLoading] = useState(false);

  const [purchasedItems, setPurchasedItems] = useState({});
  const [purchasedFood, setPurchasedFood] = useState({});
  const [purchasedWash, setPurchasedWash] = useState({});

  const fetchOwnerItems = async () => {
    try {
      setInventoryLoading(true);
      const ownerData = JSON.parse(localStorage.getItem("ownerData"));
      if (!ownerData?.address) return;

      await nakama.authenticate();
      const response = await nakama.getOwnerItems(ownerData.address);

      if (response?.payload?.items) {
        // Categorize items
        const categorized = response.payload.items.reduce((acc, item) => {
          acc[item.type] = acc[item.type] || [];
          acc[item.type].push(item);
          return acc;
        }, {});

        setItemInventory({
          food: categorized.food || [],
          wash: categorized.wash || [],
          game: categorized.game || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setInventoryLoading(false);
    }
  };

  //handle purchasing for item
  const handlePurchase = async (item) => {
    try {
      await nakama.purchaseItem(item);
      await fetchOwnerItems();
      await refreshOwner();
    } catch (error) {
      console.error("Purchase failed:", error);
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

  useEffect(() => {
    const updateRoom = async () => {
      await refreshOwner();
      if (["shop", "kitchen", "bathroom", "gameRoom"].includes(currentScreen)) {
        await fetchOwnerItems();
      }
    };
    updateRoom();
  }, [currentScreen]);

  const getOwner = async () => {
    try {
      const ownerData = JSON.parse(localStorage.getItem("ownerData"));
      if (!ownerData?.address) {
        return;
      }

      await nakama.authenticate();
      const result = await nakama.getOwner(ownerData.address);

      if (result) {
        setPlayerProfile({
          address: result.payload.owner.address,
          nickname: result.payload.owner.nickname,
          joinedAt: new Date(
            result.payload.owner.joined_at * 1000
          ).toLocaleDateString(),
          petCount: result.payload.owner.pet_count,
          lastPetTime: result.payload.owner.last_pet_time
            ? new Date(
                result.payload.owner.last_pet_time * 1000
              ).toLocaleString()
            : "Never",
          balance: result.payload.owner.balance, // Add this line to include balance
        });
      }
    } catch (error) {
      console.error("Get Owner Error:", error);
      setPlayerProfile(null);
    }
  };

  // Refresh owner data
  const refreshOwner = async () => {
    await getOwner();
  };

  // Handle screen changes
  useEffect(() => {
    refreshOwner();
  }, [currentScreen]);

  // Handle swap completion
  const handleSwapComplete = async () => {
    await refreshOwner();
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };


  const [showUniswap, setShowUniswap] = useState(false);

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
                    className="flex items-center space-x-4 w-full p-3 hover:bg-[#A8E6CF] rounded-lg transition-all">
                    <span className="text-2xl">🏪</span>
                    <span className="text-lg font-semibold text-[#4b4b4b]">
                      Shop
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen("kitchen")}
                    className="flex items-center space-x-4 w-full p-3 hover:bg-[#A8E6CF] rounded-lg transition-all">
                    <span className="text-2xl">🍳</span>
                    <span className="text-lg font-semibold text-[#4b4b4b]">
                      Kitchen
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen("bathroom")}
                    className="flex items-center space-x-4 w-full p-3 hover:bg-[#A8E6CF] rounded-lg transition-all">
                    <span className="text-2xl">🚽</span>
                    <span className="text-lg font-semibold text-[#4b4b4b]">
                      Bathroom
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen("gameRoom")}
                    className="flex items-center space-x-4 w-full p-3 hover:bg-[#A8E6CF] rounded-lg transition-all">
                    <span className="text-2xl">🎮</span>
                    <span className="text-lg font-semibold text-[#4b4b4b]">
                      Game Room
                    </span>
                  </button>

                  <button
                    onClick={() => router.push("/wiki")}
                    className="flex items-center space-x-4 w-full p-3 hover:bg-[#A8E6CF] rounded-lg transition-all">
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

                  {inventoryLoading ? (
                    <p className="text-center text-gray-600">
                      Loading items...
                    </p>
                  ) : Object.keys(itemInventory).every(
                      (category) => itemInventory[category].length === 0
                    ) ? (
                    <p className="text-center text-gray-600">
                      You haven't purchased any items yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-6 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[350px] overflow-y-auto">
                      {Object.entries(itemInventory).map(([category, items]) =>
                        items.map((item, index) => (
                          <div
                            key={`${category}-${index}`}
                            className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md">
                            <Image
                              src={
                                item.image ||
                                `/shop/${item.title.toLowerCase()}.png`
                              }
                              alt={item.title}
                              width={80}
                              height={80}
                            />
                            <p className="text-[#5D4037] text-lg font-semibold mt-2">
                              {item.title}
                            </p>
                            <p className="text-[#5D4037] text-md">
                              {item.type} × {item.quantity || 1}
                            </p>
                          </div>
                        ))
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
                  {inventoryLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {itemInventory.food.length > 0 ? (
                        itemInventory.food.map((item, index) => (
                          <li
                            key={index}
                            className="p-3 bg-[#F4F4F4] rounded-md">
                            {item.title} x{item.quantity}
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          Your kitchen is empty. Buy some food!
                        </p>
                      )}
                    </ul>
                  )}
                </div>
              )}
              {currentScreen === "bathroom" && (
                <div>
                  <h2 className="text-xl font-bold text-[#4b4b4b]">
                    🚽 My Bathroom
                  </h2>
                  {inventoryLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {itemInventory.wash.length > 0 ? (
                        itemInventory.wash.map((item, index) => (
                          <li
                            key={index}
                            className="p-3 bg-[#F4F4F4] rounded-md">
                            {item.title} x{item.quantity}
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          Your bathroom is empty. Buy some wash items!
                        </p>
                      )}
                    </ul>
                  )}
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
            {/* Uniswap Button */}
            {/* trigger updateBalance */}
            <button
              onClick={() => setShowUniswap(true)}
              className="w-full bg-[#A8E6CF] hover:bg-[#98D6BF] text-[#5D4037] font-bold px-6 py-3 rounded-lg shadow-lg transition-all flex items-center justify-center space-x-2">
              <Image
                src="/uniswap/Metatoken.webp"
                alt="Metatoken"
                width={24}
                height={24}
              />
              <span>Buy $META</span>
            </button>

            {showUniswap && (
              <MetaSwapModal
                onClose={async () => {
                  await nakama.authenticate();
                  setShowUniswap(false);
                  await getOwner();
                }}
                onSwap={handleSwapComplete}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
