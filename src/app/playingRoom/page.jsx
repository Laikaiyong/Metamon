"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PlayingRoom = () => {
  const router = useRouter();

  // Metamon Stats
  const [metamonLevel, setMetamonLevel] = useState(1);
  const [metamonMood, setMetamonMood] = useState("Happy 😊");
  const [metamonEnergy, setMetamonEnergy] = useState(80);
  const [metamonHappiness, setMetamonHappiness] = useState(60);
  const [metamonCoins, setMetamonCoins] = useState(500);

  // Simulate Playing Action
  const playWithMetamon = () => {
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
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-[#A8D8EA] to-[#AA96DA] relative">
      

      {/* 🎮 Title Section */}
      <div className="pixel-container relative mt-16 mb-8">
        <h1 className="font-jersey text-7xl text-center mb-4 kawaii-text-shadow">
          {["P", "L", "A", "Y", "R", "O", "O", "M"].map((letter, i) => (
            <span key={i} className={`inline-block animate-bounce-${i} text-[#FFAAA5]`}>
              {letter}
            </span>
          ))}
        </h1>
        <div className="pixel-decoration"></div>
      </div>

      {/* 🎠 Game Console Frame */}
      <div className="relative p-8 kawaii-pattern rounded-3xl shadow-xl max-w-5xl w-full border-8 border-[#A8E6CF]">
        {/* 🔥 Status Bar (Similar to Pou Game UI) */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center bg-white shadow-lg p-3 rounded-xl border-4 border-[#A8E6CF] space-x-4">
        {/* Level Display */}
        <div className="flex items-center space-x-2">
          <Image src="/icons/level.png" alt="Level" width={30} height={30} />
          <p className="font-bold text-[#FFAAA5]">Lv. {metamonLevel}</p>
        </div>

        {/* Happiness Bar */}
        <div className="flex items-center space-x-2">
          <Image src="/icons/happiness.png" alt="Happiness" width={30} height={30} />
          <p className="font-bold text-[#AA96DA]">{metamonHappiness}/100</p>
        </div>

        {/* Energy Bar */}
        <div className="flex items-center space-x-2">
          <Image src="/icons/energy.png" alt="Energy" width={30} height={30} />
          <p className="font-bold text-[#A8D8EA]">{metamonEnergy}/100</p>
        </div>

        {/* Coin Display */}
        <div className="flex items-center space-x-2">
          <Image src="/icons/coin.png" alt="Coins" width={30} height={30} />
          <p className="font-bold text-[#FFD700]">{metamonCoins}</p>
        </div>
      </div>
        {/* Metamon Play Area */}
        <div className="flex justify-center items-center mt-6">
          <Image
            src="/gacha2/rare/fox/2.gif"
            alt="Metamon Playing"
            width={200}
            height={200}
            className="animate-bounce"
          />
        </div>

        {/* 🏆 Metamon Stats */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold text-[#AA96DA]">Metamon's Current Mood: {metamonMood}</h3>
          <p className="text-gray-600">⚡ Energy Level: {metamonEnergy}/100</p>
          <p className="text-gray-600">🎉 Happiness Level: {metamonHappiness}/100</p>
        </div>

        {/* 🎾 Play Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#FFAAA5] text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
            onClick={playWithMetamon}
          >
            Play with Metamon 🎾
          </button>
        </div>
      </div>

      {/* 🚀 Navigation Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          className="bg-[#A8D8EA] text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
          onClick={() => router.push("/feedRoom")}
        >
          Go to Feeding Room 🍖
        </button>

        <button
          className="bg-[#AA96DA] text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
          onClick={() => router.push("/cleanRoom")}
        >
          Go to Cleaning Room 🛁
        </button>

        <button
          className="bg-[#FFAAA5] text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
          onClick={() => router.push("/playRoom")}
        >
          Stay in Playground 🎠
        </button>
      </div>
    </div>
  );
};

export default PlayingRoom;
