"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import InteractivePoints from "./interactive-points";
import DPadButton from "./dpad-button";
import { useNakama } from "@/app/providers";

const screenData = {
    openMap: {
        title: "Open Map",
        tileMap: [
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 0
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 1
            [0, 0, 0, 0, 0, 1, 0, 0], // Row 2
            [0, 0, 0, 0, 1, 1, 1, 1], // Row 3
            [0, 1, 1, 0, 1, 0, 1, 0], // Row 4
            [0, 1, 1, 1, 1, 1, 1, 0], // Row 5
            [0, 0, 0, 1, 1, 1, 1, 0], // Row 6
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 7
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 8
        ],
        background: "/maps/map.png",
        spawnPosition: { row: 6, col: 3 }, // Default spawn position for this map
        mapChanges: {
            "2-5": { targetMap: "shop", spawnPosition: { row: 7, col: 6 } }, // Entry point to shop
            "4-1": { targetMap: "kitchen", spawnPosition: { row: 7, col: 5 } }, // Entry point to kitchen
            "4-2": { targetMap: "bathroom", spawnPosition: { row: 3, col: 4 } }, // Entry point to bathroom
            "5-5": { targetMap: "gameRoom", spawnPosition: { row: 5, col: 3 } },// Entry point to game room
        },
        interactivePoints: {
            "3-7": { menu: "eggRoomMenu"},
            "3-4": { menu: "petRoomMenu"},
        }
    },
    shop: {
        title: "Shop",
        tileMap: [
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 0
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 1
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 2
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 3
            [1, 1, 1, 1, 1, 1, 0, 0], // Row 4
            [0, 0, 0, 0, 1, 1, 0, 0], // Row 5
            [0, 0, 0, 0, 1, 1, 0, 0], // Row 6
            [1, 1, 1, 1, 1, 1, 1, 1], // Row 7
            [0, 0, 0, 0, 0, 0, 1, 0], // Row 8
        ],
        background: "/maps/shop.jpg",
        spawnPosition: { row: 7, col: 6 }, // Where the player spawns when entering
        mapChanges: {
            "8-6": { targetMap: "openMap", spawnPosition: { row: 2, col: 5 } } // Exit back to openMap
        },
        interactivePoints: {
            "4-5": { menu: "shopMenu" },
        }
    },
    kitchen: {
        title: "Kitchen",
        tileMap: [
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 0
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 1
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 2
            [0, 0, 0, 0, 0, 0, 1, 1], // Row 3
            [0, 0, 0, 0, 0, 0, 0, 1], // Row 4
            [0, 0, 0, 0, 0, 0, 0, 1], // Row 5
            [1, 1, 1, 1, 1, 1, 1, 1], // Row 6
            [0, 0, 0, 0, 1, 1, 1, 1], // Row 7
            [0, 0, 0, 0, 0, 1, 0, 0], // Row 8
        ],
        background: "/maps/kitchen.png",
        spawnPosition: { row: 7, col: 5 }, // Where the player spawns when entering
        mapChanges: {
            "8-5": { targetMap: "openMap", spawnPosition: { row: 4, col: 1 } } // Exit back to open
        },
        interactivePoints: {
            "3-7": { menu: "kitchenMenu" },
        }
    },
    bathroom: {
        title: "Bathroom",
        tileMap: [
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 0
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 1
            [0, 0 ,0, 0, 1, 0, 0, 0], // Row 2
            [0, 0, 0, 0, 1, 0, 0, 0], // Row 3
            [1, 1, 1, 1, 1, 1, 1, 1], // Row 4
            [0, 1, 1, 1, 1, 1, 1, 0], // Row 5
            [0, 0 ,0, 0, 0, 0, 0, 0], // Row 6
            [0, 0 ,0, 0, 0, 0, 0, 0], // Row 7
            [0, 0 ,0, 0, 0, 0, 0, 0], // Row 8
        ],
        background: "/maps/bathroom.png",
        spawnPosition: { row: 4, col: 4},
        mapChanges: {
            "2-4": { targetMap: "openMap", spawnPosition: { row: 4, col: 2 } }
        },
        interactivePoints: {
            "5-6": { menu: "bathroomMenu" },
        }
    },
    gameRoom: {
        title: "Game Room",
        tileMap: [
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 0
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 1
            [0, 0, 0, 1, 1, 1, 1, 1], // Row 2
            [0, 0, 0, 1, 1, 0, 0, 1], // Row 3
            [0, 1, 1, 1, 1, 1, 1, 0], // Row 4
            [0, 0, 0, 1, 1, 1, 1, 0], // Row 5
            [0, 0, 0, 1, 0, 0, 0, 0], // Row 6
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 7
            [0, 0, 0, 0, 0, 0, 0, 0], // Row 8
        ],
        background: "/maps/game-room.png",
        spawnPosition: { row: 5, col: 3},
        mapChanges: {
            "6-3": { targetMap: "openMap", spawnPosition: { row: 6, col: 5 }}
        },
        interactivePoints: {
            "4-5": { menu: "gameRoomMenu" },
        }
    }
}

export default function InteractiveScreen({ currentScreen, setCurrentScreen, onPurchase }) {
    const [position, setPosition] = useState(screenData[currentScreen].spawnPosition);
    const [showPrompt, setShowPrompt] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const tileMap = screenData[currentScreen].tileMap;

    const numRows = tileMap.length;
    const numCols = tileMap[0].length;

    // Dynamic Tile Size
    const [tileSize, setTileSize] = useState(0);


    useEffect(() => {
        const updateTileSize = () => {
            const container = document.querySelector('.game-container');
            if (container) {
                const containerWidth = container.clientWidth;
                setTileSize(Math.min(containerWidth / numCols, containerWidth / numRows));
            }
        };

        updateTileSize();
        window.addEventListener('resize', updateTileSize);
        return () => window.removeEventListener('resize', updateTileSize);
    }, [numCols, numRows]);

    // Handle open menu when on interactive point
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "e" && showPrompt) {
                setMenuOpen(true);
            }
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };
    
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [showPrompt]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setTileSize(Math.min(600 / numCols, 600 / numRows));
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [numCols, numRows]);

    // Handle Map Change Spawn Position
    useEffect(() => {
        setPosition(screenData[currentScreen].spawnPosition);
    }, [currentScreen]);

    const handleMove = (direction) => {
            let newRow = position.row;
            let newCol = position.col;
        
            switch (direction) {
                case "up": if (newRow > 0 && tileMap[newRow - 1][newCol] !== 0) newRow--; break;
                case "down": if (newRow < numRows - 1 && tileMap[newRow + 1][newCol] !== 0) newRow++; break;
                case "left": if (newCol > 0 && tileMap[newRow][newCol - 1] !== 0) newCol--; break;
                case "right": if (newCol < numCols - 1 && tileMap[newRow][newCol + 1] !== 0) newCol++; break;
                default: return;
            }
        
            const key = `${newRow}-${newCol}`;
            const newMapData = screenData[currentScreen]?.mapChanges[key];
        
            if (newMapData) {
                setCurrentScreen(newMapData.targetMap);
                setTimeout(() => {
                    setPosition(newMapData.spawnPosition);
                    setMenuOpen(false);
                }, 0);
            } else {
                setPosition({ row: newRow, col: newCol });

                const interactivePoint = screenData[currentScreen]?.interactivePoints?.[key];
        
            if (interactivePoint) {
                setShowPrompt(true);
                setCurrentMenu(interactivePoint.menu);
            } else {
                setShowPrompt(false);
                setMenuOpen(false);
            }
            }
        
            
    };

    // Movement and Map Change
    useEffect(() => {
        const handleKeyDown = (event) => {
            let newRow = position.row;
            let newCol = position.col;

            switch (event.key) {
                case "ArrowUp":    if (newRow > 0 && tileMap[newRow - 1][newCol] !== 0) newRow--; break;
                case "ArrowDown":  if (newRow < numRows - 1 && tileMap[newRow + 1][newCol] !== 0) newRow++; break;
                case "ArrowLeft":  if (newCol > 0 && tileMap[newRow][newCol - 1] !== 0) newCol--; break;
                case "ArrowRight": if (newCol < numCols - 1 && tileMap[newRow][newCol + 1] !== 0) newCol++; break;
                default: return;
            }

            const key = `${newRow}-${newCol}`;
            const newMapData = screenData[currentScreen]?.mapChanges[key];

            if (newMapData) {
                setCurrentScreen(newMapData.targetMap);
                setTimeout(() => {
                    setPosition(newMapData.spawnPosition);
                    setShowPrompt(false);
                    setCurrentMenu(null);
                    setMenuOpen(false);
                }, 0);
            } else {
                setPosition({ row: newRow, col: newCol });

                const interactivePoint = screenData[currentScreen]?.interactivePoints?.[key];

            if (interactivePoint) {
                setShowPrompt(true);
                setCurrentMenu(interactivePoint.menu);
            } else {
                setShowPrompt(false);
                setMenuOpen(false);
            }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentScreen, position, setCurrentScreen]);

    return (
        <>
            {/* Game Screen */}
            <div className="relative w-full aspect-square max-w-[600px] border-8 border-[#A8E6CF] bg-cover bg-center game-container"
                style={{ backgroundImage: `url(${screenData[currentScreen]?.background})` }}
            >
                <Image 
                    src="/hooman.png" 
                    alt="Metamon" 
                    width={tileSize} 
                    height={tileSize}
                    style={{ position: "absolute", top: `${position.row * tileSize}px`, left: `${position.col * tileSize}px`, maxWidth: '100%', objectFit: 'contain' }} 
                />
                
                {/* Interaction Prompt */}
                {showPrompt && !menuOpen && (
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white py-2 px-3 rounded">
                        Press E to open menu
                    </div>
                )}
            </div>
    
            {/* Interactive Menu - Placed Outside of Game Screen */}
            {menuOpen && currentMenu && (
                <InteractivePoints menuType={currentMenu} onClose={() => setMenuOpen(false)} onPurchase={onPurchase} />
            )}

        {/* Mobile D-Pad Controls - 3x3 Grid Layout + Interactive Button*/}
        <div className="flex justify-between items-center lg:hidden">
                <div className="grid grid-cols-3 gap-2 w-40 mt-6">
                    {/* Row 1 */}
                    <div></div>
                    <button
                        onClick={() => handleMove("up")}
                        className="transition-transform active:scale-105"
                    >
                        <DPadButton content={"/dpad-buttons/up.png"}/>
                    </button>
                    <div></div>

                    {/* Row 2 */}
                    <button 
                        className="w-14 h-14 text-white rounded-lg flex items-center justify-center active:bg-gray-900 transition-transform active:scale-105"
                        onClick={() => handleMove("left")}
                    >
                        <DPadButton content={"/dpad-buttons/left.png"}/>
                    </button>
                    <div></div>
                    <button 
                        className="w-14 h-14 text-white rounded-lg flex items-center justify-center active:bg-gray-900 transition-transform active:scale-105"
                        onClick={() => handleMove("right")}
                    >
                        <DPadButton content={"/dpad-buttons/right.png"}/>
                    </button>

                    {/* Row 3 */}
                    <div></div>
                    <button 
                        className="w-14 h-14 text-white rounded-lg flex items-center justify-center active:bg-gray-900 transition-transform active:scale-105"
                        onClick={() => handleMove("down")}
                    >
                        <DPadButton content={"/dpad-buttons/down.png"}/>
                    </button>
                    <div></div>
                </div>

                <div>
                    <div className="grid grid-cols-3 gap-2 w-40 mt-6">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <button 
                        className="w-14 h-14 text-white rounded-lg flex items-center justify-center active:bg-gray-900 transition-transform active:scale-105"
                        onClick={() => setMenuOpen(true)}
                    >
                        <DPadButton content={"/dpad-buttons/i.png"}/>
                    </button>
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
        </div>
        </>
    );
}
