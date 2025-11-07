"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AccountHeader } from "@/components/account/accountHeader";
import { SettingsCard } from "@/components/account/settingsCard";
import FireData from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const settingsCards = [
  {
    title: "Login & Security",
    description: "Edit login, email, and password",
    iconName: "ShieldCheck",
    href: "/account/management",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Your Address",
    description: "Edit, remove or set default address",
    iconName: "MapPin",
    href: "/account/addresses",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Your Orders",
    description: "Track, return, or view past orders",
    iconName: "ShoppingBag",
    href: "/account/orders",
    color: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export default function SettingsMain() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("SettingsMain: Starting auth listener...");

    const unsubscribe = onAuthStateChanged(FireData.auth, async (user) => {
      if (!user) {
        console.warn("SettingsMain: User not authenticated");
        router.push("/login");
        return;
      }

      console.log("SettingsMain: Got user:", user.uid);

      try {
        setLoading(true);

        console.log("Fetching user document by ID...");
        const userDocRef = doc(FireData.db, "User", user.uid);
        const userDoc = await getDoc(userDocRef);

        console.log("User document exists?", userDoc.exists());

        if (!userDoc.exists()) {
          console.log("No user document found for this UserID");
          setUserData({ firstName: "", lastName: "", email: "" });
        } else {
          const data = userDoc.data();
          console.log("Found user document data:", data);

          const userData = {
            firstName: data?.firstName || "",
            lastName: data?.lastName || "",
            email: data?.email || "",
          };
          console.log("Setting user data:", userData);
          setUserData(userData);
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Failed to fetch user data:", errorMessage);
        if (e instanceof Error) {
          console.error("Error stack:", e.stack);
        }
        setUserData({ firstName: "", lastName: "", email: "" });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg text-gray-600">
            Loading your account settings...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AccountHeader
        firstName={userData?.firstName}
        lastName={userData?.lastName}
        email={userData?.email}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsCards.map((card) => (
          <SettingsCard
            key={card.href}
            title={card.title}
            description={card.description}
            iconName={card.iconName}
            href={card.href}
            color={card.color}
            iconColor={card.iconColor}
          />
        ))}
      </div>
    </>
  );
}
