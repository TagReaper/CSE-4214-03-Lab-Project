"use server";
import { adminDb, adminAuth } from "@/firebase/adminApp";
//import { verifyUserAndCheckRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function approveProduct(productId) {
  // permission check
  //   try {
  //     await verifyUserAndCheckRole("admin");
  //   } catch (error) {
  //     return { error: error.message };
  //   }

  if (!productId) {
    return { error: "Product ID is required." };
  }

  // pull product from db
  try {
    const productDoc = adminDb.collection("Inventory").doc(productId);

    // update db entry
    await productDoc.update({
      approved: "true",
    });
  } catch (error) {
    console.error("Error approving product:", error);
    return { error: "Failed to update the product in the database." };
  }

  // refresh data on page
  revalidatePath("/adminpanel");

  return { success: `Product ${productId} has been approved.` };
}

export async function approveSeller(sellerId) {
  // permission check
  //   try {
  //     await verifyUserAndCheckRole("admin");
  //   } catch (error) {
  //     return { error: error.message };
  //   }
  if (!sellerId) {
    return { error: "Seller ID is required." };
  }

  // pull seller from db
  try {
    const sellerDocRef = adminDb.collection("Seller").doc(sellerId);
    const sellerDoc = await sellerDocRef.get();

    if (!sellerDoc.exists) {
      return { error: "Seller document not found." };
    }

    const uid = sellerDoc.data().UserID;

    if (!uid) {
      return { error: "UserID (uid) not found in the seller document." };
    }

    // update custom claims
    const userRecord = await adminAuth.getUser(uid);
    const customClaims = userRecord.customClaims || {};

    const newClaims = {
      ...customClaims,
      role: "seller",
      status: "approved_seller",
    };

    await adminAuth.setCustomUserClaims(uid, newClaims);

    // update db entry
    await sellerDocRef.update({
      validated: "true",
    });
  } catch (error) {
    console.error("Error approving seller:", error);
    if (error.code === "auth/user-not-found") {
      return { error: "Firebase Auth user not found. Cannot set claims." };
    }
    return { error: "Failed to update the seller in the database." };
  }

  revalidatePath("/adminpanel");
  return { success: `UserID: ${sellerId} has been approved to be a seller.` };
}
