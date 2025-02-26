"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
        }
    }
}

export default function InteractiveScreen({ currentScreen, setCurrentScreen }) {
    const [position, setPosition] = useState(screenData[currentScreen].spawnPosition);

    const tileMap = screenData[currentScreen].tileMap;

    const numRows = tileMap.length;
    const numCols = tileMap[0].length;

    // Dynamic Tile Size
    const [tileSize, setTileSize] = useState(
        Math.min(600 / numCols, 600 / numRows)
    );

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
                }, 0);
            } else {
                setPosition({ row: newRow, col: newCol });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentScreen, position, setCurrentScreen]);

    return (
        <>
            <div className="relative w-[600px] h-[600px] border-8 border-[#A8E6CF] bg-cover" style={{ backgroundImage: `url(${screenData[currentScreen]?.background})` }}>
                <Image src="/gacha2/rare/fox/2.png" alt="Metamon" width={tileSize} height={tileSize} style={{ position: "absolute", top: `${position.row * tileSize}px`, left: `${position.col * tileSize}px` }} />
            </div>
        </>
    );
}
