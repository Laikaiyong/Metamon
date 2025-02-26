"use client";

import foodItems from "@/data/foodItems";
import Image from "next/image";

export default function InteractivePoints({ menuType, onClose, onPurchase }) {
    const menus = {
        kichenMenu: <KitchenMenu onClose={onClose} />,
        shopMenu: <ShopMenu onClose={onClose} onPurchase={onPurchase}/>, // Pass onClose to ShopMenu
        bathroomMenu: <BathroomMenu onClose={onClose} />,
        gameRoomMenu: <GameRoomMenu onClose={onClose}/>
    };

    const isKnownInteraction = !!menus[menuType];

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-4 rounded">
            {menus[menuType] || <div>Unknown Interaction</div>}

            {/* Show close button only if it's an unknown interaction */}
            {!isKnownInteraction && (
                <button className="mt-4 bg-red-500 p-2" onClick={onClose}>
                    Close
                </button>
            )}
        </div>
    );
};

const ShopMenu = ({ onClose, onPurchase }) => {
    return (
        <>
            <div className="flex items-center justify-center bg-opacity-50">
                <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-[550px] flex flex-col items-center">
                    {/* Decorative Header */}
                    <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
                        Welcome to Metashop!
                    </div>

                    {/* Book-style UI */}
                    <div className="p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[150px] flex flex-col items-center">
                        <p className="text-center text-[#5D4037] font-semibold text-lg">
                            Metamon is craving for food! Add to stock now!
                        </p>
                    </div>

                    {/* Food Items Grid Layout */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[300px] overflow-y-auto">
                        {foodItems.map((item, index) => (
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
                                    <button onClick={() => onPurchase(item.name)} className="bg-[#FFAAA5] text-white px-3 py-1 rounded-lg shadow-md hover:scale-105 transition-transform">
                                        Buy
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

const BathroomMenu = ({ onClose }) => {
    return (
        <>
        <div className="flex items-center justify-center bg-opacity-50">
                <div className="relative bg-[#F5E6C8] border-[6px] border-[#D4B483] p-6 rounded-lg shadow-lg w-[1000px] h-[550px] flex flex-col items-center">
                    {/* Decorative Header */}
                    <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#D4B483] px-6 py-2 rounded-md shadow-md text-white font-bold text-lg">
                        Welcome to Metashop!
                    </div>

                    {/* Book-style UI */}
                    <div className="p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[150px] flex flex-col items-center">
                        <p className="text-center text-[#5D4037] font-semibold text-lg">
                            Metamon is craving for food! Add to stock now!
                        </p>
                    </div>

                    {/* Food Items Grid Layout */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF3E0] border-[3px] border-[#D4B483] rounded-lg shadow-inner w-full h-[300px] overflow-y-auto">
                        {foodItems.map((item, index) => (
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
                                    <button className="bg-[#FFAAA5] text-white px-3 py-1 rounded-lg shadow-md hover:scale-105 transition-transform">
                                        Buy
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