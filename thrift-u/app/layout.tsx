import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import Image from "next/image";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";

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
      <head>
        <style>
        </style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative w-full">
          <Navbar />
          {/* <ul style={{color: 'white', backgroundColor: "black", outlineStyle: 'solid', outlineWidth: '3px', outlineColor: 'white', listStyleType: "none", overflow: 'hidden'}}>
            <li style={{float: "left"}}><span style={{display: 'inline-flex', padding: '5px', gap:'5px', alignItems:'center'}}>
              <Link href = {"/"}> <Image className="dark" src="/Graphics/ThriftULogoModern.png" alt="Home logo" width={65} height={42} /> </Link>
            </span></li>
            <li style={{float: "right"}}><span style={{direction: 'rtl', display: 'inline-flex', padding: '5px', gap:'5px', alignItems:'center'}}>
              <Image className="dark:invert" src="/Icons/buyer.svg" alt="Home logo" width={30} height={30} />
              <Link href = {"/login"}> Login </Link>
            </span></li>
          </ul> */}
        </div>
        <div>
          {""}
        </div>
        {children}
      </body>
    </html>
  );
}
