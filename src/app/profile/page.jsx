"use client";

import Image from "next/image";

export default function ProfilePage() {
    return (
        <main className="grid grid-cols-2 items-center justify-center px-10 py-10">
            {/* Left Side */}
            <div className="flex flex-col min-h-screen">
                <div className="border border-[#1C1C1C] rounded-[16px] h-[600px] flex flex-col items-center space-y-6 px-4">
                    {/* Card Title */}
                    <h1 className="text-[32px] w-[90%] rounded-[16px] bg-[#3B3B3B] text-center text-white">METAMON INFO</h1>

                    {/* Metamon Image */}
                    <div className="">
                        <Image src="/gacha/legendary/kitsune/2.png" alt="Profile Picture" width="200" height="200" className="rounded-full"/>
                    </div>
        
                    {/* Metamon Name */}
                    <h3 className="text-[20px]">The Ultimate Kitsune</h3>
                    
                    {/* Experience Bar */}
                    <div className="w-full mt-4">
                        <p className="text-gray-500">EXP: <span className="font-semibold">1200/2000</span></p>
                        <div className="w-full bg-gray-300 rounded-full h-3">
                            <div className="bg-[#3B3B3B] h-3 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                    </div>

                    {/* Metamon Properties */}
                    <div>

                    </div>
                </div>

                <div>
                    Stats
                </div>
            </div>
            
            {/* Right Side */}
            <div className="">
                <div>

                </div>
                <div>

                </div>
                <div>

                </div>
            </div>
        </main>
    );
}
