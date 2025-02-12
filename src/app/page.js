"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [account, setAccount] = useState(null);

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log(' Connected to MetaMask: ', accounts[0]);
      } catch (error) {
        console.error('Failed to connect to MetaMask', error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  const disconnectMetaMask = async () => {
    setAccount(null);
    console.log('Disconnected from MetaMask');
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error('Failed to trigger MetaMask explorer', error);
      }
    }
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-8"
      style={{ backgroundImage: "url('/MetamonBackground.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Gaming Fonts Link */}
      <div className="mt-4">
        <a href="https://www.fontspace.com/category/gaming">
          <img src="https://see.fontimg.com/api/rf5/m2L8j/MzU2NTYxMDkxZDY4NDY4N2E1YTUyOTRhZjgzZWFiZGMudHRm/TWV0YW1vbg/super-pixel.png?r=fs&h=81&w=1250&fg=000000&bg=FFFFFF&tb=1&s=65" alt="Gaming fonts" />
        </a>
      </div>

      {/* Login Section */}
      <div className="mt-8 p-6 bg-[#eadccf] rounded-lg shadow-lg max-w-md w-full text-white text-center border border-[#415a77] flex flex-col items-center">
        {/* GIF Image */}
        <div className="w-32 mb-4">
          <img src="/gif.gif" alt="Animated GIF" className="w-full rounded-lg shadow-lg" />
        </div>  
        
        {/* Button Section (Centered) */}
        <div className="w-full flex flex-col items-center">
          <button
            onClick={connectToMetaMask}
            className="w-4/5 bg-[#8c7951] text-white font-bold py-2 rounded mt-4 hover:bg-[#9a6b54] transition"
          >
            {account ? `Connected: ${truncateAddress(account)}` : 'Connect to MetaMask'}
          </button>

          {account && (
            <button
              onClick={disconnectMetaMask}
              className="w-4/5 bg-[#e63946] text-white font-bold py-2 rounded mt-4 hover:bg-[#d62828] transition"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
