"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useNakama } from "../providers";

const Dashboard = () => {
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

      console.log(
        "Owner ", owner
      )
      if (owner)
      {
        setPlayerProfile({
          address: owner.address,
          nickname: owner.nickname,
          joinedAt: new Date(owner.joined_at * 1000).toLocaleDateString(),
          petCount: owner.pet_count,
          lastPetTime: owner.last_pet_time ? new Date(owner.last_pet_time * 1000).toLocaleString() : 'Never'
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
        1: 'common',
        2: 'rare', 
        3: 'epic',
        4: 'legendary'
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
      <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-5xl border-8 border-[#A8E6CF] mb-8">
        <div className="flex items-center space-x-6">
          {/* Player Avatar */}
          <Image
            src="https://pbs.twimg.com/profile_images/1522047602702880769/rUanH7Tv_400x400.jpg"
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
                Your Pets ({pets.length})
            </h2>
            
            <div className="grid grid-cols-3 gap-4 w-full">
                {pets.map((petId) => (
                    <div key={petId} className="bg-[#fef4f4] rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-bold text-center mb-2">Pet #{petId}</h3>

                        <div className="flex flex-col items-center">
                          {/* Pet Image */}
                          <Image
                            src="/gacha/common/dog/1.png" // Default image, should be updated with actual pet image
                            alt={`Pet ${petId}`}
                            width={80}
                            height={80}
                            className="mb-2 rounded-lg"
                          />
                          
                          {/* Pet Stats */}
                          <div className="w-full space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Level:</span>
                              <span className="font-bold">1</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Happiness:</span>
                              <span className="font-bold">100%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Last Fed:</span>
                              <span className="font-bold">2h ago</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-3 flex gap-2">
                            <button 
                              className="px-3 py-1 text-sm bg-[#A8D8EA] text-white rounded-lg hover:opacity-80 transition-opacity"
                              onClick={() => console.log(`Feed pet ${petId}`)}>
                              Feed
                            </button>
                            <button 
                              className="px-3 py-1 text-sm bg-[#FFAAA5] text-white rounded-lg hover:opacity-80 transition-opacity"
                              onClick={() => console.log(`Play with pet ${petId}`)}>
                              Play
                            </button>
                          </div>
                        </div>
                    </div>
                ))}
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
