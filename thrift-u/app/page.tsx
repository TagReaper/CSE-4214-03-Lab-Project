'use client';

import {useEffect} from 'react';
import Image from "next/image";
import {useAuthState} from "react-firebase-hooks/auth";
import FireData from "../firebase/clientApp";
import { useRouter } from "next/navigation";
import "./globals.css";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Home() {
  const router = useRouter();

  // Check sign-in state
  const [user] = useAuthState(FireData.auth);

  useEffect(() => {
    // Pushed to login if they aren't logged in
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return <div className="center">
      <Image style={{filter:'invert(100%)'}}src="/Graphics/ThriftULogoModern.png" alt="ThriftU Logo" width={400} height={400}/>
      Home Page
      <button className="loginbutton" onClick={async () => {
          await FireData.auth.signOut();
          await fetch("/api/auth", { //send token to api route to set cookie
            method: "POST",
        });
      }}>Sign Out</button>
      <CarouselMain></CarouselMain>
      <div className="flex flex-row justify-center items-start gap-6 flex-wrap">
        <Carousel1 />
        <Carousel2 />
        <Carousel3 />
      </div>
    </div>
}

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
          {Array.from({ length: 12 }).map((_, index) => (
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
          {Array.from({ length: 3 }).map((_, index) => (
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
          {Array.from({ length: 3 }).map((_, index) => (
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
          {Array.from({ length: 3 }).map((_, index) => (
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