import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Image from "next/image";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThriftU",
  description: "University thrifting by you, for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div style={{backgroundColor: "black", alignItems: 'center', gap: '5px', outlineColor: '#c5c5c5', outlineStyle: 'solid', outlineWidth: '3px'}}>
          <span style={{display: 'inline-flex', padding: '5px', gap:'5px', alignItems:'center'}}>
            <Image className="dark:invert" src="/Icons/home.svg" alt="Home logo" width={30} height={30} />
            <Link href = {"/"}> Home </Link>
          </span>
          <span style={{display: 'inline-flex', padding: '5px', gap:'5px', alignItems:'center'}}>
            <Image className="dark:invert" src="/Icons/buyer.svg" alt="Home logo" width={30} height={30} />
            <Link href = {"/login"}> Login </Link>
          </span>
          <span style={{display: 'inline-flex', padding: '5px', gap:'5px', alignItems:'center'}}>
            <Image className="dark:invert" src="/Icons/seller.svg" alt="Home logo" width={30} height={30} />
            <Link href = {"/signup"}> Sign-Up </Link>
          </span>
        </div>
        <div>
          {" "}
        </div>
        {children}
      </body>
    </html>
  );
}
