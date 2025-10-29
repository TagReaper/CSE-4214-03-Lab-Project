import { redirect } from "next/navigation";
import { adminDb } from "@/firebase/adminApp";
import { getAuthUser } from "@/lib/auth";
import { AddressDisplayManager } from "@/components/account/addressDisplay";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type AddressData = {
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
};

async function getAddressData(uid: string): Promise<AddressData> {
  console.log("Attempting to get address data for UserID:", uid);
  try {
    console.log("Fetching document by ID...");
    const buyerDoc = await adminDb.collection("Buyer").doc(uid).get();
    
    console.log("Document exists?", buyerDoc.exists);

    if (!buyerDoc.exists) {
      console.log("No buyer document found for this UserID");
      return { Address: "", City: "", State: "", ZipCode: "" };
    }
    
    const buyerData = buyerDoc.data();
    console.log("Found document data:", buyerData);
    
    const addressData = {
      Address: buyerData?.Address || "",
      City: buyerData?.City || "",
      State: buyerData?.State || "",
      ZipCode: buyerData?.ZipCode || "",
    };
    console.log("Returning address data:", addressData);
    return addressData;
  } catch (e) {
    if (e instanceof Error) {
      console.error("Failed to fetch address data:", e.message);
      console.error("Error stack:", e.stack);
    } else {
      console.error("Failed to fetch address data: An unknown error occurred.", e);
    }
    return { Address: "", City: "", State: "", ZipCode: "" };
  }
}

export default async function AddressPage() {
  console.log("AddressPage: Starting...");
  let user;
  try {
    console.log("AddressPage: Attempting to get auth user...");
    user = await getAuthUser();
    console.log("AddressPage: Got user:", user.uid);
  } catch (error) {
    console.warn("AddressPage: User not authenticated", error);
    //redirect("/login");
  }

  console.log("AddressPage: Fetching address data...");
  const currentAddress: AddressData = await getAddressData(user.uid);
  console.log("AddressPage: Address data retrieved:", currentAddress);

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Address</CardTitle>
          <CardDescription>
            View and update your primary address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddressDisplayManager currentAddress={currentAddress} />
        </CardContent>
      </Card>
    </div>
  );
}