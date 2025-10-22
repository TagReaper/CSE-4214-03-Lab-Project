'use client';

import Image from "next/image";
import {useAuthState} from "react-firebase-hooks/auth";
import FireData from "../firebase/clientApp";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {
  const router = useRouter();

  // Check sign-in state
  const [user] = useAuthState(FireData.auth);
  let userSession;
  if (sessionStorage) {
    userSession = sessionStorage.getItem('user');
  }

  console.log('Current user:', user);

  // Pushed to login if they aren't logged in
  if (!user && !userSession) {
    router.push("/login");
  }

  return <div className="center">
      <Image style={{filter:'invert(100%)'}}src="/Graphics/ThriftULogoModern.png" alt="ThriftU Logo" width={400} height={400}/>
      Home Page
      <button className="loginbutton" onClick={async () => {
          await FireData.auth.signOut();
          sessionStorage.removeItem('user');
      }}>Sign Out</button>
      </div>
}
