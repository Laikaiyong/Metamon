"use client";

import { useState } from "react";
import Image from "next/image";

const Dashboard = () => {
  const [selectedAction, setSelectedAction] = useState(null);

  // Define Gacha Evolution Data (Categorized)
  const gachaEvolution = {
    common: [
      { id: "#C001", name: "Common Dog 1", img: "/gacha/common/dog/1.png" },
      { id: "#C002", name: "Common Dog 2", img: "/gacha/common/dog/2.png" },
      { id: "#C003", name: "Common Dog 3", img: "/gacha/common/dog/3.png" },
    ],
    rare: [
      { id: "#R001", name: "Rare Pet 1", img: "/gacha/rare/deer/1.png" },
      { id: "#R002", name: "Rare Pet 2", img: "/gacha/rare/deer/2.png" },
      { id: "#R003", name: "Rare Pet 2", img: "/gacha/rare/deer/3.png" },
    ],
    epic: [
      { id: "#E001", name: "Epic Pet 1", img: "/gacha/epic/dragon/1.png" },
      { id: "#E002", name: "Epic Pet 2", img: "/gacha/epic/dragon/2.png" },
      { id: "#E003", name: "Epic Pet 2", img: "/gacha/epic/dragon/3.png" },
    ],
    legendary: [
      { id: "#L001", name: "Legendary Pet 1", img: "/gacha/legendary/golem/1.png" },
      { id: "#L002", name: "Legendary Pet 2", img: "/gacha/legendary/golem/2.png" },
      { id: "#L003", name: "Legendary Pet 2", img: "/gacha/legendary/golem/3.png" },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-[#A8D8EA] to-[#AA96DA]">
      {/* Title Section */}
      <div className="pixel-container relative mb-8">
        <h1 className="font-jersey text-8xl text-center mb-4 kawaii-text-shadow">
          {["D", "A", "S", "H", "B", "O", "A", "R", "D"].map((letter, i) => (
            <span key={i} className={`inline-block animate-bounce-${i} text-[#FFAAA5]`}>
              {letter}
            </span>
          ))}
        </h1>
        <div className="pixel-decoration"></div>
      </div>

      {/* Game Console Frame (WIDER) */}
      <div className="relative p-8 kawaii-pattern rounded-3xl shadow-xl max-w-5xl w-full border-8 border-[#A8E6CF]">
        
        {/* Buttons Inside Wider Game Console Frame */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            className={`w-1/3 text-white font-jersey py-3 rounded-xl text-2xl
            shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white/30 ${
              selectedAction === "newEgg" ? "bg-[#FFAAA5] to-[#FFB5B5]" : "bg-gradient-to-r from-[#A8D8EA] to-[#AA96DA]"
            }`}
            onClick={() => setSelectedAction("newEgg")}
          >
            New Egg 🥚
          </button>

          <button
            className={`w-1/3 text-white font-jersey py-3 rounded-xl text-2xl
            shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white/30 ${
              selectedAction === "managePet" ? "bg-[#FFAAA5] to-[#FFB5B5]" : "bg-gradient-to-r from-[#A8D8EA] to-[#AA96DA]"
            }`}
            onClick={() => setSelectedAction("managePet")}
          >
            Manage Pet 🐾
          </button>

          <button
            className={`w-1/3 text-white font-jersey py-3 rounded-xl text-2xl
            shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white/30 ${
              selectedAction === "evolutionDictionary" ? "bg-[#FFAAA5] to-[#FFB5B5]" : "bg-gradient-to-r from-[#A8D8EA] to-[#AA96DA]"
            }`}
            onClick={() => setSelectedAction("evolutionDictionary")}
          >
            Evolution 📖
          </button>
        </div>
      </div>

      {/* Evolution List (BELOW the Game Console) */}
      {selectedAction === "evolutionDictionary" && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-5xl border-8 border-[#A8E6CF]">
          <h2 className="text-center text-2xl font-bold text-[#FFAAA5] mb-4">Evolution List</h2>

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
                    <Image src={pet.img} alt={pet.name} width={100} height={100} className="mb-2" />
                    <span className="font-bold text-lg">{pet.id}</span>
                    <span className="text-[#AA96DA] font-semibold">{pet.name}</span>
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
