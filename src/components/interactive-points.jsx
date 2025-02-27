"use client";

import foodItems from "@/data/foodItems";
import washItems from "@/data/washItems"; // Sample wash items
import gameItems from "@/data/gameItems";
import eggsData from "@/data/eggsData";
import petData from "@/data/petData";
import { useState, useEffect } from "react";

import { useNakama } from "@/app/providers";

import Image from "next/image";

export default function InteractivePoints({ menuType, onClose, onPurchase }) {
  const menus = {
    kitchenMenu: <KitchenMenu onClose={onClose} foodItems={foodItems} onFeed={handleFeed} />
    ,
    shopMenu: <ShopMenu onClose={onClose} onPurchase={onPurchase} />,
    bathroomMenu: <BathroomMenu onClose={onClose} />,
    gameRoomMenu: <GameRoomMenu onClose={onClose} />,
    eggRoomMenu: <EggRoomMenu onClose={onClose} />,
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

  const categories = {
    food: foodItems,
    wash: washItems,
    game: gameItems,
  };

  return (
    <>
      <div className="flex items-center justify-center bg-opacity-50">
        <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-[600px] flex flex-col items-center">
          {/* Decorative Header */}
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
            Welcome to Metashop!
          </div>

          <div className="p-4 m-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[150px] flex flex-col items-center">
            <p className="text-center text-[#5D4037] font-semibold text-lg">
              Buy something for your Metamon!
            </p>
            {/* Add category : one for food, one for wash item, one for game item */}
            {/* Category Selection Buttons */}
            <div className="flex space-x-4 my-4">
              <button
                className={`px-4 py-2 rounded-md font-semibold shadow-md transition-all ${
                  category === "food"
                    ? "bg-[#D4B483] text-white"
                    : "bg-[#FAF3E0] text-[#5D4037]"
                }`}
                onClick={() => setCategory("food")}
              >
                🍎 Food
              </button>
              <button
                className={`px-4 py-2 rounded-md font-semibold shadow-md transition-all ${
                  category === "wash"
                    ? "bg-[#D4B483] text-white"
                    : "bg-[#FAF3E0] text-[#5D4037]"
                }`}
                onClick={() => setCategory("wash")}
              >
                🧼 Wash Items
              </button>
              <button
                className={`px-4 py-2 rounded-md font-semibold shadow-md transition-all ${
                  category === "game"
                    ? "bg-[#D4B483] text-white"
                    : "bg-[#FAF3E0] text-[#5D4037]"
                }`}
                onClick={() => setCategory("game")}
              >
                🎮 Game Items
              </button>
            </div>
          </div>

          {/* Item Grid Display */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[350px] overflow-y-auto">
            {categories[category].length > 0 ? (
              categories[category].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                  <p className="text-[#5D4037] text-lg font-semibold mt-2">
                    {item.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md">
                      {item.price} 🪙
                    </span>
                    <button
                      onClick={() => onPurchase(item.name)}
                      className="bg-[#FFAAA5] text-white px-3 py-1 rounded-lg shadow-md hover:scale-105 transition-transform"
                    >
                      Buy
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

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
          >
            ✖
          </button>
        </div>
      </div>
    </>
  );
};

const BathroomMenu = ({ onClose }) => {
  const [cleanliness, setCleanliness] = useState(0);
  const [isWashing, setIsWashing] = useState(false);

  // Fix: Ensure cleanliness value is valid
  const handleWash = (item) => {
    if (typeof cleanliness !== "number") {
      setCleanliness(0); // Reset to prevent NaN
    }

    if (cleanliness < 100) {
      setIsWashing(true);
      setTimeout(() => {
        setCleanliness((prev) => {
          const newCleanliness = Math.min(
            (prev || 0) + item.cleanlinessBoost,
            100
          );
          return isNaN(newCleanliness) ? 0 : newCleanliness; // Ensure it's never NaN
        });
        setIsWashing(false);
      }, 800);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center bg-opacity-50">
        <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-[550px] flex flex-col items-center">
          {/* Decorative Header */}
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
            🛁 Time to Wash Metamon!
          </div>

          {/* Metamon Display */}
          <div className="p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[150px] flex flex-col items-center justify-center relative">
            <p className="text-center text-[#5D4037] font-semibold text-lg">
              Your Metamon needs a bath! 🧼
            </p>

            {/* Metamon Images */}
            <div className="relative mt-2">
              <Image
                src="/gacha2/rare/fox/1.png"
                alt="Dirty Metamon"
                width={100}
                height={100}
                className={cleanliness === 100 ? "hidden" : "block"}
              />
              <Image
                src="/gacha2/rare/fox/2.png"
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
                style={{ width: `${cleanliness || 0}%` }}
              ></div>
            </div>
            <p className="text-center text-[#3B4D61] mt-2">
              Cleanliness: {cleanliness || 0}%
            </p>
          </div>

          {/* Wash Items Grid Layout */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[300px] overflow-y-auto">
            {washItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md hover:scale-105 transition-transform"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                />
                <p className="text-[#5D4037] text-lg font-semibold mt-2">
                  {item.name}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => handleWash(item)}
                    className="bg-[#FFAAA5] text-white px-3 py-1 rounded-lg shadow-md hover:scale-110 transition-transform"
                  >
                    Use
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
          >
            ✖
          </button>
        </div>
      </div>
    </>
  );
};

const handleFeed = (foodName) => {
  console.log(`Feeding Metamon with ${foodName}`);
};


const KitchenMenu = ({ onClose, foodItems, onFeed }) => { 
  return (
    <div className="flex items-center justify-center bg-opacity-50">
      <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-auto">
        
        {/* Welcome Title */}
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
          🍳 Welcome to The Kitchen!
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          ✖
        </button>

        {/* Food List */}
        <div className="mt-8 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-auto">
          <h2 className="text-xl font-bold text-[#5D4037] text-center">
            Your Available Food Items 🍽️
          </h2>

          {foodItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 p-4">
              {foodItems.map((food, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md"
                >
                  {/* Food Image */}
                  <img
                    src={food.image}
                    alt={food.name}
                    width={80}
                    height={80}
                  />
                  
                  {/* Food Name & Quantity */}
                  <p className="text-[#5D4037] font-semibold mt-2">
                    {food.name} x{food.quantity}
                  </p>

                  {/* Feed Button */}
                  <button
                    onClick={() => onFeed(food.name)}
                    className="mt-2 bg-[#FFAAA5] text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
                  >
                    🍽️ Feed
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-4">
              Your kitchen is empty. Buy some food! 🛒
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


const GameRoomMenu = ({ onClose }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="flex items-center justify-center bg-opacity-50">
      <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[900px] h-[600px] flex flex-col items-center">
        {/* Header (Styled like Shop) */}
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-8 py-3 rounded-md shadow-md text-white font-bold text-lg">
          🎮 Time for Game !
        </div>

        {/* Game Selection */}
        {selectedGame === null ? (
          <>
            <div className="p-4 m-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full flex flex-col items-center">
              <p className="text-center text-[#5D4037] font-semibold text-lg">
                Select a game for Metamon!
              </p>
              <Image
                src="/gacha2/rare/fox/2.png"
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
                  <Image
                    src="/game-items/memory-card-game.png"
                    alt="Memory Game"
                    width={80}
                    height={80}
                  />
                  <p className="text-[#5D4037] font-semibold mt-2">
                    Memory Card Game
                  </p>
                  <button
                    onClick={() => setSelectedGame("memory")}
                    className="mt-2 bg-[#FFAAA5] text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
                  >
                    🧠 Play
                  </button>
                </div>

                {/* Catch the Falling Items */}
                <div className="flex flex-col items-center p-4 border-[3px] border-[#D4B483] bg-[#FDF6E3] rounded-lg shadow-md">
                  <Image
                    src="/game-items/arcade-machine.png"
                    alt="Catch Game"
                    width={80}
                    height={80}
                  />
                  <p className="text-[#5D4037] font-semibold mt-2">
                    Catch the Falling Items
                  </p>
                  <button
                    onClick={() => setSelectedGame("catch")}
                    className="mt-2 bg-[#FFD700] text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
                  >
                    🍎 Play
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : selectedGame === "memory" ? (
          <MemoryCardGame onExit={() => setSelectedGame(null)} />
        ) : (
          <CatchFallingItemsGame onExit={() => setSelectedGame(null)} />
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          ✖
        </button>
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
  }, [gameOver]); // ✅ Stop timer when game is over

  const handleCardClick = (index) => {
    if (flippedIndexes.length === 2 || matchedPairs.includes(index)) return;

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

  useEffect(() => {
    if (matchedPairs.length === cards.length && cards.length > 0) {
      setGameOver(true);
      setTimerRunning(false); // ✅ Stop the timer
    }
  }, [matchedPairs]);

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
            onClick={() => handleCardClick(index)}
          >
            {flippedIndexes.includes(index) || matchedPairs.includes(index) ? (
              <Image src={card.image} alt={card.name} width={80} height={80} />
            ) : (
              <div className="relative w-[100px] h-[140px] rounded-lg shadow-md cursor-pointer transform transition-all">
                <Image
                  src="/game-items/memory-card-game.png"
                  alt="Memory Game Card"
                  layout="fill" // Fills the entire card
                  objectFit="cover" // Ensures the image covers the card without distortion
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {gameOver && (
        <p className="text-center text-black font-bold text-xl mt-4">🎉 You Win!</p>
      )}

      <button
        onClick={onExit}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
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
  }, []);

  // Move falling items downward
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setFallingItems((prev) =>
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
      <div className="text-center font-bold text-lg mb-2">Score: {score} 🍏</div>

      {/* Game Area */}
      <div
        className="relative border border-gray-500"
        style={{ width: gameWidth, height: gameHeight, backgroundColor: "#dcdcdc" }}
      >
        {/* Falling Items */}
        {fallingItems.map((item) => (
          <div
            key={item.id}
            className="absolute"
            style={{ left: item.x, top: item.y }}
          >
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
          <Image src="/dpad-buttons/left.png" alt="Move Left" width={50} height={50} />
        </button>
        <button onClick={() => handleMove(1)}>
          <Image src="/dpad-buttons/right.png" alt="Move Right" width={50} height={50} />
        </button>
      </div>

      {/* Exit Button */}
      <div className="flex justify-center mt-4">
        <button onClick={onExit} className="bg-red-500 text-white px-4 py-2 rounded">
          Exit
        </button>
      </div>
    </>
  );
};

const EggRoomMenu = ({ onClose }) => {
  const [selectedEgg, setSelectedEgg] = useState(null);
  const [isHatching, setIsHatching] = useState(false);

  const nakama = useNakama();

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
      const selectedRarity = selectRarityByChance(selectedEgg.chances);
      const response = await nakama.createEgg(owner.address, selectedRarity);

      console.log("Hatched egg:", response);
      alert(`Successfully hatched a ${selectedRarity} Metamon!`);
      handleBackToEggs();
    } catch (error) {
      console.error("Failed to hatch egg:", error);
      alert("Failed to hatch egg. Please try again.");
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
                    className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md hover:scale-105 transition-transform cursor-pointer"
                  >
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
                      className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md mt-2 hover:bg-[#C4A473]"
                    >
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
                className="bg-[#D4B483] text-white px-4 py-2 rounded-lg mb-4 hover:bg-[#C4A473]"
              >
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
                    )} mb-2`}
                  >
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
        ${isHatching ? "opacity-50 cursor-not-allowed" : "hover:bg-[#FF9A95]"}`}
                  >
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
            className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
          >
            ✖
          </button>
        </div>
      </div>
    </>
  );
};

const PetRoomMenu = ({ onClose }) => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [petData, setPetData] = useState(null);

  const nakama = useNakama();

  const handleGetSelectedPet = async (petId) => {
    try { 
      await nakama.authenticate();
      const result = await nakama.getPetInfo(petId);

      setPetData(result);
    } catch (error) {
      console.error("Failed to get pet info:", error);
      alert("Failed to get pet info. Please try again.");
    }
  }
  
  const handleGetOwnerPets = async () => {
    try {
      await nakama.authenticate();
      const owner = JSON.parse(localStorage.getItem("ownerData"));
      const pets = await nakama.getOwnerPets(owner.address);

      console.log("Owner Pets", pets);
      return pets;
    } catch (error) {
      console.error("Failed to get owner pets:", error);
      alert("Failed to get owner pets. Please try again.");
      return [];
    }
  };

  useEffect(() => {
    const fetchPets = async () => {
      const pets = await handleGetOwnerPets();
      setPetData(pets);
    };

    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      handleGetSelectedPet(selectedPet);
    }
  }, [selectedPet]);

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
                {petData &&
                  petData.map((pet) => (
                    <div
                      key={pet.id}
                      className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md hover:scale-105 transition-transform cursor-pointer"
                    >
                      <a className="relative w-[100px] h-[100px]">
                        <Image
                          src={pet.image}
                          alt={pet.name}
                          fill
                          objectFit="contain"
                        />
                      </a>
                      <p className="text-[#5D4037] text-lg font-semibold mt-2">
                        {pet.name}
                      </p>
                      <p
                        className={`${getRarityColor(pet.rarity)} font-bold mt-1`}
                      >
                        {pet.rarity.toUpperCase()}
                      </p>
                      <button
                        onClick={() => setSelectedPet(pet.id)}
                        className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md mt-2 hover:bg-[#C4A473]"
                      >
                        VIEW PET
                      </button>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            petData && (
              <div className="p-6 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner">
                <button
                  onClick={handleBackToPets}
                  className="bg-[#D4B483] text-white px-4 py-2 rounded-lg mb-4 hover:bg-[#C4A473]"
                >
                  Back
                </button>
                <div className="flex items-center gap-8">
                  <div className="relative w-[200px] h-[200px]">
                    <Image
                      src={petData.image}
                      alt={petData.name}
                      fill
                      objectFit="contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#5D4037] mb-4">
                      {petData.name}
                    </h2>
                    <p
                      className={`font-bold ${getRarityColor(
                        petData.rarity
                      )} mb-4`}
                    >
                      {petData.rarity.toUpperCase()}
                    </p>

                    <div className="bg-white p-4 rounded-lg mb-4">
                      <h3 className="font-bold text-[#5D4037] mb-2">Stats:</h3>
                      <ul className="space-y-2">
                        <li className="text-red-500">
                          Health: {petData.stats.health}
                        </li>
                        <li className="text-orange-500">
                          Attack: {petData.stats.attack}
                        </li>
                        <li className="text-blue-500">
                          Defense: {petData.stats.defense}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
          >
            ✖
          </button>
        </div>
      </div>
    </>
  );
};

