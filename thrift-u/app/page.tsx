'use client';

import Image from "next/image";
import {useAuthState} from "react-firebase-hooks/auth";
import FireData from "../firebase/clientApp";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {

  const [user] = useAuthState(FireData.auth);
  const router = useRouter();

  console.log('Current user:', user);

  if (!user) {
    router.push("/login");
  }

  return <div className="center">
      <Image style={{filter:'invert(100%)'}}src="/Graphics/ThriftULogoModern.png" alt="ThriftU Logo" width={400} height={400}/>
      Home Page
      </div>
}
