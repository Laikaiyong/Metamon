"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Map = () => {
  const router = useRouter();
  const [position, setPosition] = useState({ top: 275, left: 250 });

  // Define a single coordinate for testing
  const coordinates = [
    { top: 370, left: 340 },
  ];

  // Handle keyboard events to move Metamon
  useEffect(() => {
    const handleKeyDown = (event) => {
      setPosition((prevPosition) => {
        const newPosition = { ...prevPosition };
        const step = 40;
        const roomWidth = 1200; // Increase the width limit
        const roomHeight = 900; // Increase the height limit
        const metamonSize = 100;

        switch (event.key) {
          case "ArrowUp":
            if (prevPosition.top - step >= 0) {
              newPosition.top -= step;
            }
            break;
          case "ArrowDown":
            if (prevPosition.top + step <= roomHeight - metamonSize) {
              newPosition.top += step;
            }
            break;
          case "ArrowLeft":
            if (prevPosition.left - step >= 0) {
              newPosition.left -= step;
            }
            break;
          case "ArrowRight":
            if (prevPosition.left + step <= roomWidth - metamonSize) {
              newPosition.left += step;
            }
            break;
          default:
            break;
        }

        // Check if Metamon exactly touches the coordinate
        coordinates.forEach((coord) => {
          if (
            newPosition.top >= coord.top &&
            newPosition.top < coord.top + 50 &&
            newPosition.left >= coord.left &&
            newPosition.left < coord.left + 50
          ) {
            router.push("/playingRoom");
          }
        });

        return newPosition;
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen relative" style={{ backgroundImage: "url('/room/map.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute transition-all duration-500" style={{ top: `${position.top}px`, left: `${position.left}px` }}>
        <Image src="/gacha2/rare/fox/2.png" alt="Metamon Walking" width={100} height={100} />
      </div>
      {coordinates.map((coord, index) => (
        <div key={index} className="absolute bg-red-500" style={{ top: `${coord.top}px`, left: `${coord.left}px`, width: '50px', height: '50px' }}>
        </div>
      ))}
    </div>
  );
};

export default Map;