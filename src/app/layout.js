import "./globals.css";
import { Providers } from "./providers";
// import { Jersey_10 } from 'next/font/google';
import { Press_Start_2P } from "next/font/google";
import "../../node_modules/nes.css/css/nes.css";
import "nes.css/css/nes.min.css";
// const jersey = Jersey_10({
//   weight: '400',
//   subsets: ['latin'],
// });

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
})

export const metadata = {
  title: "Metamon",
  description: "An open-source Pokémon-like tamagotchi game",
openGraph: {
  title: 'Metamon',
  description: 'An open-source Pokémon-like tamagotchi game',
  url: 'https://metamon.vercel.app',
  siteName: 'Metamon',
  images: [
    {
      url: '/og.png',
      width: 1200,
      height: 630,
    },
  ],
  locale: 'en-US',
  type: 'website',
},
twitter: {
  card: 'summary_large_image',
  title: 'Metamon',
  description: "An open-source Pokémon-like tamagotchi game",
  images: ['/og.png'],
}
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
      <body
        className={`${pressStart2P.className} antialiased`}
      >
        {children}
      </body>
      </Providers>
    </html>
  );
}
