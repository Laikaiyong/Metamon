"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FeedingRoom = () => {
  const router = useRouter();

  // Metamon Stats
  const [metamonLevel, setMetamonLevel] = useState(1);
  const [metamonMood, setMetamonMood] = useState("Happy 😊");
  const [metamonEnergy, setMetamonEnergy] = useState(80);
  const [metamonHappiness, setMetamonHappiness] = useState(60);
  const [metamonCoins, setMetamonCoins] = useState(500);

  // Metamon Position
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Pop-up visibility state
  const [showPopup, setShowPopup] = useState(false);

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
      switch (event.key) {
        case "ArrowUp":
          setPosition((prevPosition) => ({ ...prevPosition, top: prevPosition.top - 50 }));
          break;
        case "ArrowDown":
          setPosition((prevPosition) => ({ ...prevPosition, top: prevPosition.top + 50 }));
          break;
        case "ArrowLeft":
          setPosition((prevPosition) => ({ ...prevPosition, left: prevPosition.left - 50 }));
          break;
        case "ArrowRight":
          setPosition((prevPosition) => ({ ...prevPosition, left: prevPosition.left + 50 }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Check if Metamon is in the center of the room design
  const isMetamonInCenter = position.top === 200 && position.left === 450;

  return (
    <div className="flex flex-row items-center justify-center min-h-screen p-8 relative" style={{ backgroundColor: "black" }}>
      
      {/* 📜 LEFT SIDE: LIST OF ITEMS */}
      <div className="flex flex-col space-y-4 p-4 bg-gray-900 rounded-lg shadow-lg">
      <div className="pixel-container relative mt-16 mb-8">
        <h1 className="font-jersey text-7xl text-center mb-4 kawaii-text-shadow">
          {["S", "H", "O", "P"].map((letter, i) => (
            <span key={i} className={`inline-block animate-bounce-${i} text-[#FFAAA5]`}>
              {letter}
            </span>
          ))}
        </h1>
        <div className="pixel-decoration"></div>
      </div>
        <h2 className="text-white text-xl font-bold text-center">🍽️ Food List</h2>

        {/* Example Food Items (Update with real images) */}
        <div className="flex items-center space-x-2">
          <Image src="/food/apple.png" alt="Apple" width={40} height={40} />
          <p className="text-white">Apple - 🍎 +50 Energy</p>
        </div>

        <div className="flex items-center space-x-2">
          <Image src="/food/carrot.png" alt="Carrot" width={40} height={40} />
          <p className="text-white">Carrot - 🥕 +30 Happiness</p>
        </div>

        <div className="flex items-center space-x-2">
          <Image src="/food/broccoli.png" alt="Broccoli" width={40} height={40} />
          <p className="text-white">Broccoli - 🥦 +20 Defense</p>
        </div>
      </div>

      {/* 🎮 MIDDLE SECTION: ROOM DESIGN */}
      <div className="relative mx-0" style={{
        backgroundImage: "url('/room/buy.jpg')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "1000px",
        height: "650px"
      }}>
        
        {/* Metamon Walking Animation */}
        <div className="absolute transition-all duration-500" style={{ top: `${position.top}px`, left: `${position.left}px` }}>
          <Image src="/gacha/rare/fox/fox1.png" alt="Metamon Walking" width={100} height={100} />
        </div>  

        {/* 🎾 Play Button */}
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
        {/* Go to counter to shop for items */}
      </div>

      {/* 📌 RIGHT SIDE: NAVIGATION BUTTONS */}
      <div className="flex flex-col space-y-4 p-4 bg-gray-900 rounded-lg shadow-lg">
        {/* <h2 className="text-white text-xl font-bold text-center">🌍 Rooms</h2> */}
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
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Welcome to Metashop!</h2>
            <p>Metamon is having a great time shopping with you!</p>
            <button
              className="mt-4 bg-[#FFAAA5] text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedingRoom;