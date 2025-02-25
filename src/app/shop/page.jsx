"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Shop = () => {
  const router = useRouter();

  // Metamon Stats
  const [metamonLevel, setMetamonLevel] = useState(1);
  const [metamonMood, setMetamonMood] = useState("Happy 😊");
  const [metamonEnergy, setMetamonEnergy] = useState(80);
  const [metamonHappiness, setMetamonHappiness] = useState(60);
  const [metamonHunger, setMetamonHunger] = useState(50);
  const [metamonHygiene, setMetamonHygiene] = useState(70);
  const [metamonCoins, setMetamonCoins] = useState(500);

  // Metamon Position
  const [position, setPosition] = useState({ top: 275, left: 250 });

  // Pop-up visibility state
  const [showPopup, setShowPopup] = useState(false);

  // Evolution stages
  const evolutionStages = [
    { stage: 1, image: "/gacha2/rare/fox/1.png" },
    { stage: 2, image: "/gacha2/rare/fox/2.png" },
    { stage: 3, image: "/gacha2/rare/fox/3.png" },
  ];

  // Simulate Playing Action
  const buyItems = () => {
    setMetamonMood("Excited 🤩");
    setMetamonEnergy((prevEnergy) => Math.max(prevEnergy - 10, 0));
    setMetamonHappiness((prevHappiness) => Math.min(prevHappiness + 10, 100));

    // Earn coins when playing
    setMetamonCoins((prevCoins) => prevCoins + 5);

    // Level up condition
    if (metamonHappiness >= 90 && metamonEnergy >= 70) {
      setMetamonLevel((prevLevel) => prevLevel + 1);
      setMetamonHappiness(50); // Reset happiness after level-up
    }

    // Show pop-up
    setShowPopup(true);
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      setPosition((prevPosition) => {
        const newPosition = { ...prevPosition };
        const step = 50;
        const roomWidth = 600;
        const roomHeight = 650;
        const metamonSize = 100;

        // Define the border areas
        const borderTopHeight = 200;
        const borderRightWidth = 350;
        const borderLeftWidth = 380;

        switch (event.key) {
          case "ArrowUp":
            if (prevPosition.top - step >= 0 && (prevPosition.top - step >= borderTopHeight || prevPosition.left >= borderLeftWidth)) {
              newPosition.top -= step;
            }
            break;
          case "ArrowDown":
            if (prevPosition.top + step <= roomHeight - metamonSize) {
              newPosition.top += step;
            }
            break;
          case "ArrowLeft":
            if (prevPosition.left - step >= 0 && (prevPosition.left - step >= borderLeftWidth || prevPosition.top >= borderTopHeight)) {
              newPosition.left -= step;
            }
            break;
          case "ArrowRight":
            if (prevPosition.left + step <= roomWidth - metamonSize && (prevPosition.left + step <= roomWidth - borderRightWidth || prevPosition.top >= borderTopHeight)) {
              newPosition.left += step;
            }
            break;
          default:
            break;
        }

        return newPosition;
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Check if Metamon is in the center of the room design
  const isMetamonInCenter = position.top === 275 && position.left === 300;

  // Food items list
  const foodItems = [
    { name: "Apple", image: "/shop/apple.png", price: 50 },
    { name: "Carrot", image: "/shop/carrot.png", price: 30 },
    { name: "Broccoli", image: "/shop/broccoli.png", price: 20 },
    { name: "Banana", image: "/shop/banana.png", price: 40 },
    { name: "Grapes", image: "/food/grapes.png", price: 60 },
    { name: "Orange", image: "/food/orange.png", price: 35 },
    { name: "Strawberry", image: "/food/strawberry.png", price: 45 },
    { name: "Watermelon", image: "/food/watermelon.png", price: 70 },
  ];

  return (
    <div className="flex flex-row items-center justify-center min-h-screen p-8 relative" style={{ backgroundColor: "black" }}>
      
      {/* 📜 LEFT SIDE: LIST OF ITEMS */}
      <div className="flex flex-col space-y-4 p-4 bg-gray-900 rounded-lg shadow-lg">
        <div className="pixel-container relative mt-16 mb-8">
          <h1 className="font-jersey text-7xl text-center mb-4 kawaii-text-shadow">
            {["S", "T", "A", "T"].map((letter, i) => (
              <span key={i} className={`inline-block animate-bounce-${i} text-[#FFAAA5]`}>
                {letter}
              </span>
            ))}
          </h1>
          <div className="pixel-decoration"></div>
        </div>
        <h2 className="text-white text-xl font-bold text-center">Metamon Status</h2>

        {/* Metamon Status */}
        <div className="flex items-center space-x-2">
          <p className="text-white">Hunger Level: {metamonHunger}</p>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-white">Happiness Level: {metamonHappiness}</p>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-white">Hygiene: {metamonHygiene}</p>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-white">Energy: {metamonEnergy}</p>
        </div>

        {/* Metamon Evolution Stage */}
        <div className="flex items-center space-x-2 mt-4">
          <p className="text-white">Evolution Stage: {metamonLevel}</p>
          {evolutionStages.map((stage) => (
            <Image key={stage.stage} src={stage.image} alt={`Stage ${stage.stage}`} width={50} height={50} />
          ))}
        </div>
      </div>

      {/* 🎮 MIDDLE SECTION: ROOM DESIGN */}
      <div className="relative mx-0" style={{
        width: "600px",
        height: "650px",
        marginLeft: "50px",
        marginRight: "50px",
      }}>
        <div className="absolute inset-0 border-8 border-red-500"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: "url('/room/buy.jpg')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}>
          {/* Metamon Walking Animation */}
          <div className="absolute transition-all duration-500" style={{ top: `${position.top}px`, left: `${position.left}px` }}>
            <Image src="/gacha2/rare/fox/2.png" alt="Metamon Walking" width={100} height={100} />
          </div>  

          {/* 🎾 Shop Button */}
          {isMetamonInCenter && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                className="bg-[#FFAAA5] text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
                onClick={buyItems}
              >
                Shop
              </button>
            </div>
          )}

          {/* Center Position Indicator */}
          <div className="absolute" style={{ top: "300px", left: "300px" }}>
            <div className="w-20 h-20 bg-red-500 rounded-full"></div>
          </div>

          {/* Border Position Indicators */}
          <div className="absolute" style={{ top: "250px", left: "0px", width: "600px", height: "8px", backgroundColor: "blue" }}></div>
          <div className="absolute" style={{ top: "0px", left: "380px", width: "8px", height: "650px", backgroundColor: "blue" }}></div>
        </div>
      </div>

      {/* 📌 RIGHT SIDE: NAVIGATION BUTTONS */}
      <div className="flex flex-col space-y-4 p-4 bg-gray-900 rounded-lg shadow-lg">
        <div className="pixel-container relative mt-16 mb-8">
          <h1 className="font-jersey text-7xl text-center mb-4 kawaii-text-shadow">
            {["R", "O", "O", "M"].map((letter, i) => (
              <span key={i} className={`inline-block animate-bounce-${i} text-[#FFAAA5]`}>
                {letter}
              </span>
            ))}
          </h1>
          <div className="pixel-decoration"></div>
        </div>
        <button
          className="flex items-center bg-[#A8D8EA] text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
          onClick={() => router.push("/feedRoom")}
        >
          <Image src="/icons/feed.png" alt="Feed" width={30} height={30} className="mr-2" />
          Feeding Room 🍖
        </button>

        <button
          className="flex items-center bg-[#AA96DA] text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
          onClick={() => router.push("/cleanRoom")}
        >
          <Image src="/icons/clean.png" alt="Clean" width={30} height={30} className="mr-2" />
          Cleaning Room 🛁
        </button>

        <button
          className="flex items-center bg-[#FFAAA5] text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
          onClick={() => router.push("/playRoom")}
        >
          <Image src="/icons/play.png" alt="Play" width={30} height={30} className="mr-2" />
          Play Room 🎠
        </button>
      </div>

      {/* Pop-up */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-[550px] flex flex-col items-center">
            {/* Decorative Header */}
            <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
              Welcome to Metashop!
            </div>
  
            {/* Book-style UI */}
            <div className="p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[150px] flex flex-col items-center">
              <p className="text-center text-[#5D4037] font-semibold text-lg">Metamon is craving for food! Add to stock now!</p>
            </div>
  
            {/* Food Items Grid Layout */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[300px] overflow-y-auto">
              {foodItems.map((item, index) => (
                <div key={index} className="flex flex-col items-center bg-[#FDF6E3] p-4 rounded-lg border-[3px] border-[#D4B483] shadow-md">
                  <Image src={item.image} alt={item.name} width={80} height={80} />
                  <p className="text-[#5D4037] text-lg font-semibold mt-2">{item.name}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md">{item.price} 🪙</span>
                    <button className="bg-[#FFAAA5] text-white px-3 py-1 rounded-lg shadow-md hover:scale-105 transition-transform">
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 bg-[#FFAAA5] text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
              onClick={() => setShowPopup(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;