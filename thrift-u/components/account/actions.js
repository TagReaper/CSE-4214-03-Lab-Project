"use server";
import { adminDb } from "@/firebase/adminApp";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateAddressAction(previousState, formData) {
  let authenticatedUser;
  try {
    authenticatedUser = await getAuthUser();
  } catch (error) {
    return { error: error.message };
  }

  const address = {
    Address: formData.get("address"),
    City: formData.get("city"),
    State: formData.get("state"),
    ZipCode: formData.get("zipCode"),
  };

  if (!address.Address || !address.City || !address.State || !address.ZipCode) {
    return { error: "All address fields are required." };
  }

  try {
    const buyerQuery = adminDb
      .collection("Buyer")
      .where("UserID", "==", authenticatedUser.uid)
      .limit(1);

    const buyerSnapshot = await buyerQuery.get();

    if (buyerSnapshot.empty) {
      console.error("No buyer profile found for user:", authenticatedUser.uid);
      return { error: "Buyer profile not found for this user." };
    }

    const buyerDocRef = buyerSnapshot.docs[0].ref;
    await buyerDocRef.update({
      Address: address.Address,
      City: address.City,
      State: address.State,
      ZipCode: address.ZipCode,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return { error: "Failed to update the address in the database." };
  }

  revalidatePath("/account/addresses");
  return { success: "Address has been updated." };
}
