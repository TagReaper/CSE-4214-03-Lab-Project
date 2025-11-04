import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import Image from "next/image";
import "./globals.css";
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselMain() {
  return (
    <div className="relative w-full max-w-sm mx-auto text-center">
    
      <h2 className="text-3xl font-bold mb-4 text-black">
        Hot New Sellers
      </h2>

    
      <Carousel
        opts={{ align: "start" }}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">
                      {index + 1}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}


export function Carousel1() {
  return (
    <div className="relative w-full max-w-xs mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-black">Sports</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {Array.from({ length: 7 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export function Carousel2() {
  return (
    <div className="relative w-full max-w-xs mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-black">Clothing</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {Array.from({ length: 7 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export function Carousel3() {
  return (
    <div className="relative w-full max-w-xs mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-black">College</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {Array.from({ length: 7 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}



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
        <div>
          <ul style={{color: 'white', backgroundColor: "black", outlineStyle: 'solid', outlineWidth: '3px', outlineColor: 'white', listStyleType: "none", overflow: 'hidden'}}>
            <li style={{float: "left"}}><span style={{display: 'inline-flex', padding: '5px', gap:'5px', alignItems:'center'}}>
              <Link href = {"/"}> <Image className="dark" src="/Graphics/ThriftULogoModern.png" alt="Home logo" width={65} height={42} /> </Link>
            </span></li>
            <li style={{float: "right"}}><span style={{direction: 'rtl', display: 'inline-flex', padding: '5px', gap:'5px', alignItems:'center'}}>
              <Image className="dark:invert" src="/Icons/buyer.svg" alt="Home logo" width={30} height={30} />
              <Link href = {"/login"}> Login </Link>
            </span></li>
          </ul>
        </div>
        <div>
          {""}
        </div>
        {children}
      </body>
    </html>
  );
}
