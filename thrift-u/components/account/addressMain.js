"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AddressDisplay } from "@/components/account/addressDisplay";
import FireData from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AddressMain() {
  const router = useRouter();
  const [currentAddress, setCurrentAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FireData.auth, async (user) => {
      if (!user) {
        console.warn("User not authenticated");
        router.push("/login");
        return;
      }

      //console.log("Got user:", user.uid);

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching document by ID...");
        const buyerDocRef = doc(FireData.db, "Buyer", user.uid);
        const buyerDoc = await getDoc(buyerDocRef);

        //console.log("Document exists?", buyerDoc.exists());

        if (!buyerDoc.exists()) {
          console.log("No buyer document found for this UserID");
          setCurrentAddress({ Address: "", City: "", State: "", ZipCode: "" });
        } else {
          const buyerData = buyerDoc.data();
          //console.log("Found document data:", buyerData);

          const addressData = {
            Address: buyerData?.Address || "",
            City: buyerData?.City || "",
            State: buyerData?.State || "",
            ZipCode: buyerData?.ZipCode || "",
          };
          //console.log("Setting address data:", addressData);
          setCurrentAddress(addressData);
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Failed to fetch address data:", errorMessage);
        if (e instanceof Error) {
          console.error("Error stack:", e.stack);
        }
        setError(errorMessage);
        setCurrentAddress({ Address: "", City: "", State: "", ZipCode: "" });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Address</CardTitle>
          <CardDescription>Loading your address information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Address</CardTitle>
        <CardDescription>View and update your primary address.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            Error loading address: {error}
          </div>
        )}
        <AddressDisplay currentAddress={currentAddress} />
      </CardContent>
    </Card>
  );
}
