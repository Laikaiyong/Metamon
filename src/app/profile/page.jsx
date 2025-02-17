"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % metamon.image.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <>
            <main className="px-[100px] py-[100px]">
                <div className="nes-container with-title is-centered flex flex-col items-center justify-center p-8 mx-auto max-w-max">
                    <p className="title">
                        Metamon Info
                    </p>
                    {/* Metamon Image */} 
                    <div className="relative w-[200px] h-[200px] nes-container">
                        <Image 
                            src={metamon.image[currentImageIndex]}
                            alt="Metamon"
                            fill
                            objectFit="contain"
                        />
                    </div>
                    {/* Metamon Info */}
                    <div>
                        <div>
                            <p>{metamon.name}</p>
                        </div>
                        <div className="text-[12px]">
                            <p>LVL: {metamon.level}</p>
                        </div>
                        <div className="flex items-center gap-2 text-center">
                            {/* Rarity */}
                            <div className="nes-badge">
                                <span className="is-primary block">{metamon.rarity}</span>
                            </div>

                            {/* Allegiance */}
                            <div className="nes-badge">
                                <span className="is-dark block">{metamon.allegiance}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

const metamon = {
    name: "Ashley the Kitsune",
    level: 35,
    rarity: "LEGENDARY",
    allegiance: "TRICKSTER",
    image: [
        "/gacha/legendary/kitsune/1.png",
        "/gacha/legendary/kitsune/2.png",
        "/gacha/legendary/kitsune/3.png"
    ],
    stats:
};