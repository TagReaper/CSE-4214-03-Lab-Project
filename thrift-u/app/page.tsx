'use client';

import Image from "next/image";
import "./globals.css";
import HomePage from '../components/home'

export default function Home() {
  return <div className="center">
      <Image style={{filter:'invert(100%)', marginTop:"2rem"}}src="/Graphics/ThriftULogoModern.png" alt="ThriftU Logo" width={400} height={400}/>
      <HomePage/>
    </div>
}
