"use client";

import Image from "next/image";

const Wiki = () => {
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
  
    return (
      /* Wrapper */
      <div className="flex min-h-screen bg-gradient-to-b from-[#A8D8EA] to-[#AA96DA]">
        {/* Center Container */}
        <div className="container mx-auto flex items-center justify-center gap-6 px-6">
        {/* Evolution List */}
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
      </div>
      </div>
    );
  };
  
  export default Wiki;