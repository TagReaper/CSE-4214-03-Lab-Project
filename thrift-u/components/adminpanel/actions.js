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

export async function toggleBanStatus(id, access) {
  // permission check
  //   try {
  //     await verifyUserAndCheckRole("admin");
  //   } catch (error) {
  //     return { error: error.message };
  //   }
  if (!id) {
    return { error: "User ID is required." };
  }

  let collectionName;
  if (access === 1) {
    collectionName = "Seller";
  } else if (access === 2) {
    collectionName = "Buyer";
  } else {
    return { error: "Invalid access type provided." };
  }

  try {
    // pull from db
    const profileDocRef = adminDb.collection(collectionName).doc(profileId);
    const profileDoc = await profileDocRef.get();

    if (!profileDoc.exists) {
      return { error: "Seller/Buyer document not found." };
    }

    const profileData = profileDoc.data();
    const currentBannedStatus = profileData.banned || false;
    const newBannedStatus = !currentBannedStatus;

    // get user id from document
    const uid = profileData.UserID;
    if (!uid) {
      return {
        error: `UserID not found on ${collectionName} doc ${profileId}.`,
      };
    }

    // update document banned status
    await profileDocRef.update({
      banned: newBannedStatus,
    });

    // update main document
    await adminDb.collection("User").doc(uid).update({
      banned: newBannedStatus,
    });

    // update firebase auth disabled status
    await adminAuth.updateUser(uid, {
      disabled: newBannedStatus,
    });

    return {
      success: `User has been ${newBannedStatus ? "banned" : "unbanned"}.`,
      newBannedStatus: newBannedStatus,
    };
  } catch (error) {
    console.error("Error toggling ban status:", error);
    return { error: "A server error occurred." };
  }
}
