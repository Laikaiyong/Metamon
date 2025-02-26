"use client";

import foodItems from "@/data/foodItems";
import washItems from "@/data/washItems";  // Sample wash items
import gameItems from "@/data/gameItems";  // Sample game items
import eggsData from "@/data/eggsData";
import petData from "@/data/petData";
import { useState } from "react";

import Image from "next/image";

export default function InteractivePoints({ menuType, onClose, onPurchase }) {
    const menus = {
        kichenMenu: <KitchenMenu onClose={onClose} />,
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
};

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
                                category === "food" ? "bg-[#D4B483] text-white" : "bg-[#FAF3E0] text-[#5D4037]"
                            }`}
                            onClick={() => setCategory("food")}
                        >
                            🍎 Food
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-md font-semibold shadow-md transition-all ${
                                category === "wash" ? "bg-[#D4B483] text-white" : "bg-[#FAF3E0] text-[#5D4037]"
                            }`}
                            onClick={() => setCategory("wash")}
                        >
                            🧼 Wash Items
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-md font-semibold shadow-md transition-all ${
                                category === "game" ? "bg-[#D4B483] text-white" : "bg-[#FAF3E0] text-[#5D4037]"
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
                                    <Image src={item.image} alt={item.name} width={80} height={80} />
                                    <p className="text-[#5D4037] text-lg font-semibold mt-2">{item.name}</p>
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
                            <p className="text-center text-[#5D4037] text-lg">No items available in this category.</p>
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
                    const newCleanliness = Math.min((prev || 0) + item.cleanlinessBoost, 100);
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
                                <Image src={item.image} alt={item.name} width={80} height={80} />
                                <p className="text-[#5D4037] text-lg font-semibold mt-2">{item.name}</p>
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
    )
}


const KitchenMenu = ({ onClose }) => {

}

const GameRoomMenu = ({ onClose }) => {

}

const EggRoomMenu = ({ onClose }) => {
    const [selectedEgg, setSelectedEgg] = useState(null);

    const handleBackToEggs = () => {
        setSelectedEgg(null);
    };

    const getRarityColor = (rarity) => {
        const colors = {
            common: "text-gray-500",
            rare: "text-blue-500",
            epic: "text-purple-500",
            legendary: "text-yellow-500"
        };
        return colors[rarity.toLowerCase()] || "text-gray-500";
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
                                        <p className="text-[#5D4037] text-lg font-semibold mt-2">{item.name}</p>
                                        <p className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md mt-2">{item.price} 🪙</p>
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
                                    <h2 className="text-2xl font-bold text-[#5D4037] mb-4">{selectedEgg.name}</h2>
                                    <p className={`font-bold ${getRarityColor(selectedEgg.rarity)} mb-2`}>
                                        {selectedEgg.rarity.toUpperCase()}
                                    </p>
                                    <p className="text-[#5D4037] mb-4">{selectedEgg.description}</p>
                                    
                                    <div className="bg-white p-4 rounded-lg mb-4">
                                        <h3 className="font-bold text-[#5D4037] mb-2">Hatch Chances:</h3>
                                        <ul className="space-y-2">
                                            <li className="text-gray-500">Common Metamon: {selectedEgg.chances.common}%</li>
                                            <li className="text-blue-500">Rare Metamon: {selectedEgg.chances.rare}%</li>
                                            <li className="text-purple-500">Epic Metamon: {selectedEgg.chances.epic}%</li>
                                            <li className="text-yellow-500">Legendary Metamon: {selectedEgg.chances.legendary}%</li>
                                        </ul>
                                    </div>

                                    <button className="bg-[#FFAAA5] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#FF9A95]">
                                        Hatch Egg ({selectedEgg.price} 🪙)
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

    const handleBackToPets = () => {
        setSelectedPet(null);
    };

    const getRarityColor = (rarity) => {
        const colors = {
            common: "text-gray-500",
            rare: "text-blue-500",
            epic: "text-purple-500",
            legendary: "text-yellow-500"
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
                                {petData.map((pet) => (
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
                                        <p className="text-[#5D4037] text-lg font-semibold mt-2">{pet.name}</p>
                                        <p className={`${getRarityColor(pet.rarity)} font-bold mt-1`}>{pet.rarity.toUpperCase()}</p>
                                        <button
                                            onClick={() => setSelectedPet(pet)}
                                            className="bg-[#D4B483] text-white px-3 py-1 rounded-lg shadow-md mt-2 hover:bg-[#C4A473]"
                                        >
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
                                className="bg-[#D4B483] text-white px-4 py-2 rounded-lg mb-4 hover:bg-[#C4A473]"
                            >
                                Back
                            </button>
                            <div className="flex items-center gap-8">
                                <div className="relative w-[200px] h-[200px]">
                                    <Image
                                        src={selectedPet.image}
                                        alt={selectedPet.name}
                                        fill
                                        objectFit="contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-[#5D4037] mb-4">{selectedPet.name}</h2>
                                    <p className={`font-bold ${getRarityColor(selectedPet.rarity)} mb-4`}>
                                        {selectedPet.rarity.toUpperCase()}
                                    </p>
                                    
                                    <div className="bg-white p-4 rounded-lg mb-4">
                                        <h3 className="font-bold text-[#5D4037] mb-2">Stats:</h3>
                                        <ul className="space-y-2">
                                            <li className="text-red-500">Health: {selectedPet.stats.health}</li>
                                            <li className="text-orange-500">Attack: {selectedPet.stats.attack}</li>
                                            <li className="text-blue-500">Defense: {selectedPet.stats.defense}</li>
                                        </ul>
                                    </div>
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