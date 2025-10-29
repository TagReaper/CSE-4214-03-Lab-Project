import { redirect } from "next/navigation";
import { adminDb } from "@/firebase/adminApp";
import { getAuthUser } from "@/lib/auth";
import { AddressForm } from "@/components/account/addressForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type AddressData = {
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
};

async function getAddressData(uid: string): Promise<AddressData> {
  try {
    const buyerQuery = adminDb
      .collection("Buyer")
      .where("UserID", "==", uid)
      .limit(1);

    const buyerSnapshot = await buyerQuery.get();

    if (buyerSnapshot.empty) {
      return { Address: "", City: "", State: "", ZipCode: "" };
    }
    const buyerData = buyerSnapshot.docs[0].data();
    return {
      Address: buyerData.Address || "",
      City: buyerData.City || "",
      State: buyerData.State || "",
      ZipCode: buyerData.ZipCode || "",
    };
  } catch (error) {
    console.error("Failed to fetch address data:", error);
    return { Address: "", City: "", State: "", ZipCode: "" };
  }
}

export default async function AddressPage() {
  let user;
  try {
    user = await getAuthUser();
  } catch (error) {
    console.warn(error, "User not authenticated, redirecting to login.");
    redirect("/login");
  }

    const currentAddress: AddressData = await getAddressData(user.uid);

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
          <AddressForm currentAddress={currentAddress} />
        </CardContent>
      </Card>
    </div>
  );
}