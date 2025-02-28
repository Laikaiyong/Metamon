"use client";

import foodItems from "@/data/foodItems";
import washItems from "@/data/washItems"; // Sample wash items
import eggsData from "@/data/eggsData";
import petData from "@/data/petData";
import gameItems from "@/data/gameItems";
import { useState, useEffect } from "react";

import { useNakama } from "@/app/providers";

import Image from "next/image";

export default function InteractivePoints({ menuType, onClose, onPurchase }) {
  const menus = {
    kitchenMenu: <KitchenMenu onClose={onClose} foodItems={foodItems} />,
    shopMenu: <ShopMenu onClose={onClose} onPurchase={onPurchase} />,
    bathroomMenu: <BathroomMenu onClose={onClose} />,
    gameRoomMenu: <GameRoomMenu onClose={onClose} />,
    eggRoomMenu: <EggRoomMenu onClose={onClose} onPurchase={onPurchase} />,
    petRoomMenu: <PetRoomMenu onClose={onClose} />,
  };

  const isKnownInteraction = !!menus[menuType];

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-4 rounded">
        {menus[menuType] || <div>Unknown Interaction</div>}

        {/* Show close button only if it's an unknown interaction */}
        {!isKnownInteraction && (
          <button className="mt-4 bg-red-500 p-2" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </>
  );
}

const ShopMenu = ({ onClose, onPurchase }) => {
  const [category, setCategory] = useState("food");
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [appleCount, setAppleCount] = useState(9);
  const nakama = useNakama();

  const handlePurchase = async (item) => {
    try {
      setPurchasing(true);
      setError(null);

      await nakama.authenticate();
      const owner = JSON.parse(localStorage.getItem("ownerData"));
      const result = await nakama.getOwner(owner.address);

      if (result) {
        const newBalance = result.payload.owner.balance;
  
        if (newBalance >= item.price) {
            const response = await nakama.purchaseItem(item);
            if (response) {
              await nakama.updateBalance(-Number(item.price))
              // Increment apple count on successful purchase
              if (item.name === "Apple") {
                setAppleCount(prevCount => prevCount + 1);
              }
              alert(`Successfully purchased ${item.name}!`);
            }
        } else {
          alert("Not enough tokens to purchase eggs, PLEASE SWAP")
        }
      };
    } catch (err) {
      console.error("Purchase error:", err);
      setError("Failed to purchase item. Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  const categories = {
    food: foodItems.map(item => ({
      ...item,
      amount: item.name === "Apple" ? appleCount : item.amount // Update apple amount dynamically
    })),
    wash: washItems,
  };

  return (
    <>
      <div className="flex items-center justify-center bg-opacity-50">
        <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-[600px] flex flex-col items-center">
          {/* Rest of your component remains the same */}
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
            Welcome to Metashop!
          </div>

          <div className="p-4 m-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[150px] flex flex-col items-center">
            <p className="text-center text-[#5D4037] font-semibold text-lg">
              Buy something for your Metamon!
            </p>
            <div className="flex space-x-4 my-4">
              <button
                className={`px-4 py-2 rounded-md font-semibold shadow-md transition-all ${
                  category === "food"
                    ? "bg-[#D4B483] text-white"
                    : "bg-[#FAF3E0] text-[#5D4037]"
                }`}
                onClick={() => setCategory("food")}>
                🍎 Food
              </button>
              <button
                className={`px-4 py-2 rounded-md font-semibold shadow-md transition-all ${
                  category === "wash"
                    ? "bg-[#D4B483] text-white"
                    : "bg-[#FAF3E0] text-[#5D4037]"
                }`}
                onClick={() => setCategory("wash")}>
                🧼 Wash Items
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[350px] overflow-y-auto">
            {error && (
              <p className="text-red-500 text-center col-span-2">{error}</p>
            )}

            {categories[category].length > 0 ? (
              categories[category].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                  <p className="text-[#5D4037] text-lg font-semibold mt-2">
                    {item.name} {item.name === "Apple" ? `(${appleCount})` : `(${item.amount})`}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md">
                      {item.price} 🪙
                    </span>
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={purchasing}
                      className={`bg-[#FFAAA5] text-white px-3 py-1 rounded-lg shadow-md 
                      ${
                        purchasing
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105 transition-transform"
                      }`}>
                      {purchasing ? "Buying..." : "Buy"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#5D4037] text-lg">
                No items available in this category.
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform">
            ✖
          </button>
        </div>
      </div>
    </>
  );
};

const BathroomMenu = ({ onClose }) => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [cleanliness, setCleanliness] = useState(0);
  const [isWashing, setIsWashing] = useState(false);
  const [pets, setPets] = useState([]);
  const [petsId, setPetsId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount ] = useState(10);

  const nakama = useNakama(); // Get Nakama API instance

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        await nakama.authenticate();
        const owner = JSON.parse(localStorage.getItem("ownerData"));

        // Fetch pets from backend
        const petsData = await nakama.getOwnerPets(owner.address);
        setPets(petsData.payload.pets || []);
        setPetsId(petsData.payload.petsId || []);
        const itemData = await nakama.getOwnerItems(owner.address);
        console.log(itemData);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Failed to load pets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleWash = async (item) => {
    if (!selectedPetId) {
      console.error("No pet selected for washing.");
      return;
    }

    if (typeof cleanliness !== "number") {
      setCleanliness(0); // Reset to prevent NaN
    }

    if (cleanliness < 100) {
      setIsWashing(true);
      setAmount(amount - 1);
      setTimeout(async () => {
        setCleanliness((prev) => {
          const newCleanliness = Math.min(
            (prev || 0) + item.cleanlinessBoost,
            100
          );
          return isNaN(newCleanliness) ? 0 : newCleanliness; // Ensure it's never NaN
        });

        // Send update to backend
        try {
          await nakama.carePet(selectedPetId, "clean");
          console.log(`Cleaned ${selectedPet.dna.species} with ${item.name}`);
        } catch (error) {
          console.error("Failed to update pet cleanliness:", error);
        }

        setIsWashing(false);
      }, 800);
    }
  };

  return (
    <div className="flex items-center justify-center bg-opacity-50">
      <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-[550px] flex flex-col items-center">
        {/* Decorative Header */}
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
          🛁 Time to Wash Metamon!
        </div>

        {/* Pet Selection */}
        {!selectedPet ? (
          <>
            <div className="p-4 m-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full flex flex-col items-center">
              <p className="text-center text-[#5D4037] font-semibold text-lg">
                Select a pet to wash! 🐾
              </p>
            </div>

            {/* Show loading state */}
            {loading && (
              <p className="text-center text-gray-600">Loading pets...</p>
            )}

            {/* Show error message if failed to load */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Pet List */}
            {!loading && pets.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[400px] overflow-y-auto">
                {pets.map((pet, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => {
                      setSelectedPet(pet);
                      setSelectedPetId(petsId[index]);
                      setCleanliness(50); // Assume pet starts with some cleanliness level
                    }}>
                    <Image
                      src={`/gacha2/${pet.dna.rarity}/${pet.dna.species}/1.png`}
                      alt={pet.dna.species}
                      width={80}
                      height={80}
                    />
                    <p className="text-[#5D4037] text-lg font-semibold mt-2">
                      {pet.dna.species}
                    </p>
                    <button className="mt-2 bg-[#D4B483] text-white px-4 py-2 rounded-lg shadow-md">
                      Select
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <p className="text-center text-gray-600">No pets found.</p>
              )
            )}
          </>
        ) : (
          <>
            {/* Washing UI */}
            <div className="p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[150px] flex flex-col items-center justify-center relative">
              <p className="text-center text-[#5D4037] font-semibold text-lg">
                {selectedPet.dna.species} needs a bath! 🧼
              </p>

              {/* Metamon Images */}
              <div className="relative mt-2">
                <Image
                  src={`/gacha2/${selectedPet.dna.rarity}/${selectedPet.dna.species}/1.png`}
                  alt="Dirty Metamon"
                  width={100}
                  height={100}
                  className={cleanliness === 100 ? "hidden" : "block"}
                />
                <Image
                  src={`/gacha2/${selectedPet.dna.rarity}/${selectedPet.dna.species}/2.png`}
                  alt="Clean Metamon"
                  width={100}
                  height={100}
                  className={cleanliness === 100 ? "block" : "hidden"}
                />

                {/* Water Splash Animation */}
                {isWashing && (
                  <div className="absolute inset-0 flex justify-center items-center animate-bounce">
                    <Image
                      src="/animation-effects/water-splash.gif"
                      alt="Water Splash"
                      width={400}
                      height={400}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Cleanliness Progress Bar */}
            <div className="w-full mt-4">
              <div className="bg-gray-300 w-[80%] h-6 rounded-full overflow-hidden mx-auto">
                <div
                  className="bg-[#5DADE2] h-full transition-all duration-500"
                  style={{ width: `${cleanliness}%` }}></div>
              </div>
              <p className="text-center text-[#3B4D61] mt-2">
                Cleanliness: {cleanliness}%
              </p>
            </div>

            {/* Wash Items Grid Layout */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[300px] overflow-y-auto">
              {washItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md hover:scale-105 transition-transform">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                  <p className="text-[#5D4037] text-lg font-semibold mt-2">
                    {item.name} <span>{index === 0 ? amount : item.amount}</span>
                  </p>
                  <button
                    onClick={() => handleWash(item)}
                    className="bg-[#FFAAA5] text-white px-3 py-1 rounded-lg shadow-md hover:scale-110 transition-transform">
                    Use
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform">
          ✖
        </button>
      </div>
    </div>
  );
};

const KitchenMenu = ({ onClose, foodItems }) => {
  const [hunger, setHunger] = useState(100);
  const [isEating, setIsEating] = useState(false);
  const [eatingFood, setEatingFood] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [pets, setPets] = useState([]);
  const [petsId, setPetsId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount ] = useState(10);

  const nakama = useNakama(); // Get Nakama API instance

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        await nakama.authenticate();
        const owner = JSON.parse(localStorage.getItem("ownerData"));

        // Fetch pets from backend
        const petsData = await nakama.getOwnerPets(owner.address);
        setPets(petsData.payload.pets || []);
        setPetsId(petsData.payload.petsId || []);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Failed to load pets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleFeed = async (food) => {
    if (!food || typeof food.hungerReduction !== "number") {
      console.error("Invalid food item:", food);
      return;
    }

    setHunger((prev) => Math.max((prev || 0) - food.hungerReduction, 0));
    setEatingFood(food.name);
    setIsEating(true);
    setAmount(amount - 1);

    // Added code for carePet function
    try {
      await nakama.carePet(selectedPetId, "feed"); // ⬅️ Send action to backend
      console.log(`Fed ${selectedPet.dna.species} with ${food.name}`);
    } catch (error) {
      console.error("Failed to update pet hunger:", error);
    }

    setTimeout(() => {
      setIsEating(false);
      setEatingFood(null);
    }, 800);
  };

  return (
    <div className="flex items-center justify-center bg-opacity-50">
      <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-[600px] flex flex-col items-center">
        {/* Decorative Header */}
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
          🍽️ Time to Feed Metamon!
        </div>

        {/* Pet Selection */}
        {!selectedPet ? (
          <>
            <div className="p-4 m-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full flex flex-col items-center">
              <p className="text-center text-[#5D4037] font-semibold text-lg">
                Select a pet to feed! 🐾
              </p>
            </div>

            {loading && (
              <p className="text-center text-gray-600">Loading pets...</p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && pets.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[400px] overflow-y-auto">
                {pets.map((pet, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => {
                      setSelectedPet(pet);
                      setSelectedPetId(petsId[index]);
                    }}>
                    <Image
                      src={`/gacha2/${pet.dna.rarity}/${pet.dna.species}/1.png`}
                      alt={pet.dna.species}
                      width={80}
                      height={80}
                    />
                    <p className="text-[#5D4037] text-lg font-semibold mt-2">
                      {pet.dna.species}
                    </p>
                    <button className="mt-2 bg-[#D4B483] text-white px-4 py-2 rounded-lg shadow-md">
                      Select
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <p className="text-center text-gray-600">No pets found.</p>
              )
            )}
          </>
        ) : (
          <>
            {/* Display Selected Pet */}
            <div className="p-4 m-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full flex flex-col items-center">
              <p className="text-center text-[#5D4037] font-semibold text-lg">
                Selected Pet: {selectedPet.dna.species} 🐾
              </p>
              <Image
                src={`/gacha2/${selectedPet.dna.rarity}/${selectedPet.dna.species}/1.png`}
                alt={selectedPet.dna.species}
                width={100}
                height={100}
              />
              <button
                onClick={() => setSelectedPet(null)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md">
                Change Pet
              </button>
            </div>

            {/* Hunger Progress Bar */}
            <div className="w-full mt-4">
              <div className="bg-gray-300 w-[80%] h-6 rounded-full overflow-hidden mx-auto">
                <div
                  className="bg-[#FF8C00] h-full transition-all duration-500"
                  style={{ width: `${hunger}%` }}></div>
              </div>
              <p className="text-center text-[#3B4D61] mt-2">
                Hunger: {hunger}%
              </p>
            </div>

            {/* Food Items Grid Layout */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[300px] overflow-y-auto">
              {foodItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md hover:scale-105 transition-transform">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                  <p className="text-[#5D4037] text-lg font-semibold mt-2">
                    {item.name} <span>{index === 0 ? amount : item.amount}</span>
                  </p>
                  <button
                    onClick={() => handleFeed(item)}
                    className="mt-2 bg-[#FFAAA5] text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform">
                    Feed
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform">
          ✖
        </button>
      </div>
    </div>
  );
};
const EvolveModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] flex flex-col items-center">
        <h2 className="text-lg font-bold text-[#5D4037]">✨ Your Metamon is Evolving! ✨</h2>
        <Image
          src="/gacha2/rare/fox/evolve.gif" 
          alt="Evolving Metamon"
          width={150}
          height={150}
          className="mt-4"
        />
        <p className="text-center text-[#5D4037] mt-4">Congratulations! Your Metamon has evolved to its next form!</p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform">
          🎉 Celebrate
        </button>
      </div>
    </div>
  );
};
const GameRoomMenu = ({ onClose }) => { 
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [pets, setPets] = useState([]);
  const [petsId, setPetsId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [happiness, setHappiness] = useState(0);
  const [showEvolveModal, setShowEvolveModal] = useState(false);

  const nakama = useNakama();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        await nakama.authenticate();
        const owner = JSON.parse(localStorage.getItem("ownerData"));

        // Fetch pets from backend
        const petsData = await nakama.getOwnerPets(owner.address);
        setPets(petsData.payload.pets || []);
        setPetsId(petsData.payload.petsId || []);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Failed to load pets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleGameCompletion = async (score) => {
    if (!selectedPetId) return;

    const newHappiness = Math.min(happiness + score, 100);
    setHappiness(newHappiness);
    setSelectedGame(null); 

    // Call carePet when a game is played
    try {
      await nakama.carePet(selectedPetId, "play");
      console.log(`Cared for ${selectedPet.dna.species} with play action`);
    } catch (error) {
      console.error("Failed to update pet care:", error);
    }

    // 🦊✨ Show evolve modal when happiness reaches 100
    if (newHappiness === 100) {
      setShowEvolveModal(true);
    }
  };

  const handleEvolvePet = async () => {
    if (!selectedPetId) return;

    try {
      await nakama.evolvePet(selectedPetId);
      console.log(`Evolved ${selectedPet.dna.species}!`);
      alert(`Your ${selectedPet.dna.species} has evolved!`);
    } catch (error) {
      console.error("Failed to evolve pet:", error);
    } finally {
      setShowEvolveModal(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-opacity-50">
      <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[900px] h-[600px] flex flex-col items-center">
        {/* Header */}
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-8 py-3 rounded-md shadow-md text-white font-bold text-lg">
          🎮 Time for Game!
        </div>

        {/* Pet Selection */}
        {!selectedPet ? (
          <>
            <div className="p-4 m-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full flex flex-col items-center">
              <p className="text-center text-[#5D4037] font-semibold text-lg">
                Select a pet to play games! 🐾
              </p>
            </div>

            {loading && <p className="text-center text-gray-600">Loading pets...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && pets.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[400px] overflow-y-auto">
                {pets.map((pet, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => {
                      setSelectedPet(pet);
                      setSelectedPetId(petsId[index]);
                    }}>
                    <Image
                      src={`/gacha2/${pet.dna.rarity}/${pet.dna.species}/1.png`}
                      alt={pet.dna.species}
                      width={80}
                      height={80}
                    />
                    <p className="text-[#5D4037] text-lg font-semibold mt-2">
                      {pet.dna.species}
                    </p>
                    <button className="mt-2 bg-[#D4B483] text-white px-4 py-2 rounded-lg shadow-md">
                      Select
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              !loading && <p className="text-center text-gray-600">No pets found.</p>
            )}
          </>
        ) : (
          <>
            {/* Happiness Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-6 mt-4">
              <div className="bg-green-500 h-6 rounded-full transition-all duration-500" style={{ width: `${happiness}%` }}></div>
            </div>
            <p className="text-center text-[#5D4037] font-semibold">Happiness: {happiness}%</p>

            {/* Game Selection */}
            {selectedGame === null ? (
              <>
                <div className="p-4 m-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full flex flex-col items-center">
                  <p className="text-center text-[#5D4037] font-semibold text-lg">
                    Select a game for {selectedPet.dna.species}!
                  </p>
                  <Image
                    src={`/gacha2/${selectedPet.dna.rarity}/${selectedPet.dna.species}/1.png`}
                    alt="Metamon"
                    width={100}
                    height={100}
                    className="mt-2"
                  />
                </div>

                <div className="w-full bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Memory Card Game */}
                    <div className="flex flex-col items-center p-4 border-[3px] border-[#D4B483] bg-[#FDF6E3] rounded-lg shadow-md">
                      <Image src="/game-items/memory-card-game.png" alt="Memory Game" width={80} height={80} />
                      <p className="text-[#5D4037] font-semibold mt-2">Memory Card Game</p>
                      <button onClick={() => setSelectedGame("memory")} className="mt-2 bg-[#FFAAA5] text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform">
                        🧠 Play
                      </button>
                    </div>

                    {/* Catch the Falling Items */}
                    <div className="flex flex-col items-center p-4 border-[3px] border-[#D4B483] bg-[#FDF6E3] rounded-lg shadow-md">
                      <Image src="/game-items/arcade-machine.png" alt="Catch Game" width={80} height={80} />
                      <p className="text-[#5D4037] font-semibold mt-2">Catch the Falling Items</p>
                      <button onClick={() => setSelectedGame("catch")} className="mt-2 bg-[#FFD700] text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform">
                        🍎 Play
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : selectedGame === "memory" ? (
              <MemoryCardGame onExit={handleGameCompletion} />
            ) : (
              <CatchFallingItemsGame onExit={handleGameCompletion} />
            )}
          </>
        )}
      </div>
    </div>
  );
};



const MemoryCardGame = ({ onExit }) => {
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [timerRunning, setTimerRunning] = useState(true);



  useEffect(() => {
    const shuffledItems = [...gameItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    const memoryCards = [...shuffledItems, ...shuffledItems]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        name: item.name,
        image: item.image,
      }));

    setCards(memoryCards);
    setMatchedPairs([]);
    setFlippedIndexes([]);

    // Timer countdown
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1 || gameOver) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [gameOver]);

  useEffect(() => {
    if (matchedPairs.length === cards.length && cards.length > 0) {
      setGameOver(true);
      setTimerRunning(false); // Stop the timer
      setTimeout(() => onExit(score), 1000); // Exit after a short delay
    }
  }, [matchedPairs]);

  const handleCardClick = (index) => {
    if (flippedIndexes.length === 2 || flippedIndexes.includes(index) || matchedPairs.includes(index)) {
      return;
    }

    const newFlipped = [...flippedIndexes, index];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].name === cards[secondIndex].name) {
        setTimeout(() => {
          setMatchedPairs((prev) => [...prev, firstIndex, secondIndex]);
          setFlippedIndexes([]);
          setScore((prev) => prev + 10);
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedIndexes([]);
          setScore((prev) => Math.max(prev - 5, 0));
        }, 1000);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <p className="text-[#3B4D61] font-semibold">
          🕒 Time Left: {timerRunning ? timer : "✔️"}
        </p>
        <p className="text-[#3B4D61] font-semibold">🏆 Score: {score}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`w-[100px] h-[140px] flex items-center justify-center bg-white border-2 border-gray-300 cursor-pointer transition-transform duration-500 ${
              flippedIndexes.includes(index) || matchedPairs.includes(index)
                ? "rotate-y-180"
                : ""
            }`}
            onClick={() => handleCardClick(index)}>
            {flippedIndexes.includes(index) || matchedPairs.includes(index) ? (
              <Image src={card.image} alt={card.name} width={80} height={80} />
            ) : (
              <div className="relative w-[100px] h-[140px] rounded-lg shadow-md cursor-pointer transform transition-all">
                <Image
                  src="/game-items/memory-card-game.png"
                  alt="Memory Game Card"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {gameOver && (
        <p className="text-center text-black font-bold text-xl mt-4">
          🎉 You Win!
        </p>
      )}

      <button
        onClick={() => onExit(score)}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Exit
      </button>
    </>
  );
};


const CatchFallingItemsGame = ({ onExit }) => {
  
  const gameWidth = 400;
  const gameHeight = 390;
  const playerWidth = 80;
  const appleWidth = 30;

  const [playerX, setPlayerX] = useState(200);
  const [fallingItems, setFallingItems] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);


  // Generate falling items at random positions
  useEffect(() => {
    const interval = setInterval(() => {
      setFallingItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * (gameWidth - appleWidth), // Ensures apple stays within bounds
          y: 0,
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
    if (gameOver) {
      onExit(score);
    }
  }, [gameOver, score, onExit]);

  // Move falling items downward
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setFallingItems(
        (prev) =>
          prev
            .map((item) => ({ ...item, y: item.y + 5 }))
            .filter((item) => item.y < gameHeight - appleWidth) // Prevents out-of-bounds
      );
    }, 100);

    return () => clearInterval(moveInterval);
  }, []);

  // Move player left and right
  const handleMove = (direction) => {
    setPlayerX((prev) =>
      Math.max(0, Math.min(gameWidth - playerWidth, prev + direction * 30))
    );
  };

  // Check for collision with player
  useEffect(() => {
    setFallingItems((prev) =>
      prev.filter((item) => {
        const isCaught =
          item.y >= gameHeight - 80 && Math.abs(item.x - playerX) < 40;
        if (isCaught) setScore((prevScore) => prevScore + 1);
        return !isCaught;
      })
    );
  }, [playerX, fallingItems]);

  return (
    <>
      <div className="text-center font-bold text-lg mb-2">
        Score: {score} 🍏
      </div>

      {/* Game Area */}
      <div
        className="relative border border-gray-500"
        style={{
          width: gameWidth,
          height: gameHeight,
          backgroundColor: "#dcdcdc",
        }}>
        {/* Falling Items */}
        {fallingItems.map((item) => (
          <div
            key={item.id}
            className="absolute"
            style={{ left: item.x, top: item.y }}>
            <Image
              src="/shop/apple.png"
              alt="Apple"
              width={appleWidth}
              height={appleWidth}
            />
          </div>
        ))}

        {/* Player */}
        <div className="absolute bottom-0" style={{ left: playerX }}>
          <Image
            src="/gacha2/rare/fox/1.png"
            alt="Metamon"
            width={50}
            height={50}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-center gap-6">
        <button onClick={() => handleMove(-1)}>
          <Image
            src="/dpad-buttons/left.png"
            alt="Move Left"
            width={50}
            height={50}
          />
        </button>
        <button onClick={() => handleMove(1)}>
          <Image
            src="/dpad-buttons/right.png"
            alt="Move Right"
            width={50}
            height={50}
          />
        </button>
      </div>

      {/* Exit Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => onExit(score)}
          className="bg-red-500 text-white px-4 py-2 rounded">
          Exit
        </button>
      </div>
    </>
  );
};

const EggRoomMenu = ({ onClose }) => {
  const [selectedEgg, setSelectedEgg] = useState(null);
  const [isHatching, setIsHatching] = useState(false);
  const [balance, setBalance] = useState(0);
  const [pets, setPets] = useState([]);

  const nakama = useNakama();

  const handleGetOwnerPets = async () => {
    try {
      await nakama.authenticate();
      const owner = JSON.parse(localStorage.getItem("ownerData"));
      const pets = await nakama.getOwnerPets(owner.address);
      return pets;
    } catch (error) {
      console.error("Failed to get owner pets:", error);
      alert("Failed to get owner pets. Please try again.");
      return [];
    }
  };

  useEffect(() => {
    const fetchPets = async () => {
      const petsData = await handleGetOwnerPets();
      setPets(petsData);
    };

    fetchPets();
  }, []);

  const handleBackToEggs = () => {
    setSelectedEgg(null);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: "text-gray-500",
      rare: "text-blue-500",
      epic: "text-purple-500",
      legendary: "text-yellow-500",
    };
    return colors[rarity.toLowerCase()] || "text-gray-500";
  };

  const selectRarityByChance = (chances) => {
    let remainingChance = Math.random() * 100;

    if ((remainingChance -= chances.legendary) <= 0) return "legendary";
    if ((remainingChance -= chances.epic) <= 0) return "epic";
    if ((remainingChance -= chances.rare) <= 0) return "rare";
    return "common";
  };

  const handleHatchEgg = async () => {
    if (!selectedEgg?.id) {
      alert("Please select an egg first!");
      return;
    }

    try {
      setIsHatching(true);
      await nakama.authenticate();
      const owner = JSON.parse(localStorage.getItem("ownerData"));
      if (!owner?.address) {
        return;
      }

      const result = await nakama.getOwner(owner.address);

      if (result) {
        const newBalance = result.payload.owner.balance;
        const selectedRarity = selectRarityByChance(selectedEgg.chances);
  
        if (newBalance >= selectedEgg.price) {
            const response = await nakama.createEgg(owner.address, selectedRarity);
            await nakama.updateBalance(-Number(selectedEgg.price))
            const updatedPets = await handleGetOwnerPets();
            setPets(updatedPets.payload.pets);
            console.log("Hatched egg:", response);
            alert(`Successfully hatched a ${selectedRarity} Metamon!`);
            handleBackToEggs();
        } else {
  
            alert("Not enough tokens to purchase eggs, PLEASE SWAP")
        }
      };

    } catch (error) {
      console.error("Failed to hatch egg:", error);
    } finally {
      setIsHatching(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center bg-opacity-50">
        <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-auto">
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
            Welcome to Egg Room!
          </div>

          {!selectedEgg ? (
            <>
              <div className="p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full mb-4">
                <p className="text-center text-[#5D4037] font-semibold text-lg">
                  Choose an egg to hatch your next Metamon!
                </p>
              </div>

              <div className="grid grid-cols-4 gap-6 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner">
                {eggsData.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md hover:scale-105 transition-transform cursor-pointer">
                    <a className="relative w-[100px] h-[100px]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        objectFit="contain"
                      />
                    </a>
                    <p className="text-[#5D4037] text-lg font-semibold mt-2">
                      {item.name}
                    </p>
                    <p className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md mt-2">
                      {item.price} 🪙
                    </p>
                    <button
                      onClick={() => setSelectedEgg(item)}
                      className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md mt-2 hover:bg-[#C4A473]">
                      VIEW EGG
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner">
              <button
                onClick={handleBackToEggs}
                className="bg-[#D4B483] text-white px-4 py-2 rounded-lg mb-4 hover:bg-[#C4A473]">
                Back
              </button>
              <div className="flex items-center gap-8">
                <div className="relative w-[200px] h-[200px]">
                  <Image
                    src={selectedEgg.image}
                    alt={selectedEgg.name}
                    fill
                    objectFit="contain"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#5D4037] mb-4">
                    {selectedEgg.name}
                  </h2>
                  <p
                    className={`font-bold ${getRarityColor(
                      selectedEgg.rarity
                    )} mb-2`}>
                    {selectedEgg.rarity.toUpperCase()}
                  </p>
                  <p className="text-[#5D4037] mb-4">
                    {selectedEgg.description}
                  </p>

                  <div className="bg-white p-4 rounded-lg mb-4">
                    <h3 className="font-bold text-[#5D4037] mb-2">
                      Hatch Chances:
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-gray-500">
                        Common Metamon: {selectedEgg.chances.common}%
                      </li>
                      <li className="text-blue-500">
                        Rare Metamon: {selectedEgg.chances.rare}%
                      </li>
                      <li className="text-purple-500">
                        Epic Metamon: {selectedEgg.chances.epic}%
                      </li>
                      <li className="text-yellow-500">
                        Legendary Metamon: {selectedEgg.chances.legendary}%
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleHatchEgg}
                    disabled={isHatching}
                    className={`bg-[#FFAAA5] text-white px-6 py-2 rounded-lg shadow-md
        ${
          isHatching ? "opacity-50 cursor-not-allowed" : "hover:bg-[#FF9A95]"
        }`}>
                    {isHatching
                      ? "Hatching..."
                      : `Hatch Egg (${selectedEgg.price} 🪙)`}
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform">
            ✖
          </button>
        </div>
      </div>
    </>
  );
};

const PetRoomMenu = ({ onClose }) => {
  const [pets, setPets] = useState([]);
  const [petIds, setPetIds] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  const nakama = useNakama();

  const handleGetOwnerPets = async () => {
    try {
      await nakama.authenticate();
      const owner = JSON.parse(localStorage.getItem("ownerData"));
      const pets = await nakama.getOwnerPets(owner.address);
      return pets.payload;
    } catch (error) {
      console.error("Failed to get owner pets:", error);
      alert("Failed to get owner pets. Please try again.");
      return [];
    }
  };

  useEffect(() => {
    const fetchPets = async () => {
      const petsData = await handleGetOwnerPets();
      setPets(petsData.pets);
      setPetIds(petsData.petsId);
    };

    fetchPets();
  }, []);

  const handleBackToPets = () => {
    setSelectedPet(null);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: "text-gray-500",
      rare: "text-blue-500",
      epic: "text-purple-500",
      legendary: "text-yellow-500",
    };
    return colors[rarity.toLowerCase()] || "text-gray-500";
  };
  return (
    <>
      <div className="flex items-center justify-center bg-opacity-50">
        <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-auto">
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
            Welcome to Pet Room!
          </div>

          {!selectedPet ? (
            <>
              <div className="p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full mb-4">
                <p className="text-center text-[#5D4037] font-semibold text-lg">
                  Choose your Metamon to view its details!
                </p>
              </div>

              <div className="grid grid-cols-4 gap-6 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner">
                {pets.map((pet, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md hover:scale-105 transition-transform cursor-pointer">
                    <div className="relative w-[100px] h-[100px]">
                      <Image
                        src={`/gacha2/${pet.dna.rarity}/${pet.dna.species}/1.png`}
                        alt={pet.dna.species}
                        fill
                        objectFit="contain"
                      />
                    </div>
                    <p className="text-[#5D4037] text-lg font-semibold mt-2">
                      {pet.dna.species.charAt(0).toUpperCase() +
                        pet.dna.species.slice(1)}
                    </p>
                    <p
                      className={`${getRarityColor(
                        pet.dna.rarity
                      )} font-bold mt-1`}>
                      {pet.dna.rarity.toUpperCase()}
                    </p>
                    <button
                      onClick={() => setSelectedPet(pet)}
                      className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md mt-2 hover:bg-[#C4A473]">
                      VIEW PET
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner">
              <button
                onClick={handleBackToPets}
                className="bg-[#D4B483] text-white px-4 py-2 rounded-lg mb-4 hover:bg-[#C4A473]">
                Back
              </button>
              <div className="flex items-center gap-8">
                <div className="relative w-[200px] h-[200px]">
                  <Image
                    src={`/gacha2/${selectedPet.dna.rarity}/${selectedPet.dna.species}/1.png`}
                    alt={selectedPet.dna.species}
                    fill
                    objectFit="contain"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#5D4037] mb-4">
                    {selectedPet.dna.species.charAt(0).toUpperCase() +
                      selectedPet.dna.species.slice(1)}
                  </h2>
                  <p
                    className={`font-bold ${getRarityColor(
                      selectedPet.dna.rarity
                    )} mb-4`}>
                    {selectedPet.dna.rarity.toUpperCase()}
                  </p>

                  <div className="bg-white p-4 rounded-lg mb-4">
                    <h3 className="font-bold text-[#5D4037] mb-2">Stats:</h3>
                    <ul className="space-y-2">
                      <li className="text-red-500">
                        Health: {selectedPet.state.health}
                      </li>
                      <li className="text-yellow-500">
                        Hunger: {selectedPet.state.hunger}
                      </li>
                      <li className="text-pink-500">
                        Happiness: {selectedPet.state.happiness}
                      </li>
                      <li className="text-blue-500">
                        Hygiene: {selectedPet.state.hygiene}
                      </li>
                      <li className="text-green-500">
                        Energy: {selectedPet.state.energy}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-bold text-[#5D4037] mb-2">
                      Attributes:
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-purple-500">
                        Strength: {selectedPet.stats.strength}
                      </li>
                      <li className="text-blue-500">
                        Intelligence: {selectedPet.stats.intelligence}
                      </li>
                      <li className="text-green-500">
                        Agility: {selectedPet.stats.agility}
                      </li>
                      <li className="text-pink-500">
                        Charm: {selectedPet.stats.charm}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform">
            ✖
          </button>
        </div>
      </div>
    </>
  );
};
