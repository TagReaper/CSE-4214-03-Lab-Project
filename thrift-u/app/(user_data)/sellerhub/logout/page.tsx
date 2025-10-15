"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    
    console.log("User logged out.");
    router.push("/");
  }, [router]);

  return <p style={{ padding: "2rem" }}>Logging you out...</p>;
}
