"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WorldMap() {
  const [currentMap, setCurrentMap] = useState("/room/map.png");
  
  const tileMap = [
    [0, 0, 0]
  ];

  const numRows = tileMap.length;
  const numCols = tileMap[0].length;

  // Dynamic tile size
  const [tileSize, setTileSize] = useState(
    Math.min(1152 / numCols, 648 / numRows)
  );

  // Recalculate tile size on window resize
  useEffect(() => {
    const updateTileSize = () => {
      setTileSize(Math.min(1152 / numCols, 648 / numRows));
    };

    window.addEventListener("resize", updateTileSize);
    return () => window.removeEventListener("resize", updateTileSize);
  }, []);

  // Initial Position where Metamon will spawn
  const [position, setPosition] = useState({ row: 7, col: 7 });

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPosition((prev) => {
        let newRow = prev.row;
        let newCol = prev.col;
  
        switch (event.key) {
          case "ArrowUp":
            if (newRow > 0 && tileMap[newRow - 1][newCol] !== 0) newRow--;
            break;
          case "ArrowDown":
            if (newRow < tileMap.length - 1 && tileMap[newRow + 1][newCol] !== 0) newRow++;
            break;
          case "ArrowLeft":
            if (newCol > 0 && tileMap[newRow][newCol - 1] !== 0) newCol--;
            break;
          case "ArrowRight":
            if (newCol < tileMap[0].length - 1 && tileMap[newRow][newCol + 1] !== 0) newCol++;
            break;
          default:
            break;
        }
  
        // Check if the new position is an objective (11)
        const mapChanges = {
          "2-10": "/room/shop.jpg",
          "5-4": "/room/kitchen.png",
          "3-13": "/room/new_map_3.png",
        };
  
        const key = `${newRow}-${newCol}`;

        if (mapChanges[key]) {
          setCurrentMap(mapChanges[key]); // Change map if position matches an objective
        }

        return { row: newRow, col: newCol };
      });
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
    {/* World Map Container */}
    <div className="flex justify-center items-center min-h-screen">
      {/* World Map */}
      <div
        className="flex items-center justify-center w-[1152px] h-[648px] bg-no-repeat relative overflow-hidden bg-contain border"
        style={{ backgroundImage: `url(${currentMap})` }}
      >
        {/* Metamon */}
        <div
          className="absolute transition-all duration-200"
          style={{
            top: `${position.row * tileSize}px`,
            left: `${position.col * tileSize}px`,
            width: `${tileSize}px`,
            height: `${tileSize}px`,
          }}
        >
          <Image src="/gacha2/rare/fox/3.png" alt="Metamon" width={tileSize} height={tileSize} />
        </div>
      </div>
    </div>
    </>
  );
}