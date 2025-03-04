"use client"

import Image from "next/image";

export default function DPadButton({content}) {
    return (
        <>
            {/* <div className="text-[#d3d3d3] w-14 h-14 bg-[#D4B483] shadow-md rounded-lg flex items-center justify-center border-white border">
                {content}
            </div> */}

            <Image 
                src={content}
                alt="DPad Button"
                width={56}
                height={56}
                className="shadow-md rounded-lg" 
            />
        </>
    )
}