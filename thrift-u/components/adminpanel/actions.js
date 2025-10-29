"use server";
import { getDoc, doc, updateDoc } from "@firebase/firestore";
import FireData from "@/firebase/clientApp";
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
    // update db entry
    await updateDoc(doc(FireData.db, "Inventory", productId), {
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
    const sellerDoc = await getDoc(doc(FireData.db, "Seller", sellerId));
    console.log(":", sellerDoc.data());

    if (!sellerDoc.exists) {
      return { error: "Seller document not found." };
    }

    const uid = sellerId;

    if (!uid) {
      return { error: "UserID (uid) not found in the seller document." };
    }

    // removed custom claims
    // const userRecord = await adminAuth.getUser(uid);
    // const customClaims = userRecord.customClaims || {};

    // const newClaims = {
    //   ...customClaims,
    //   role: "seller",
    //   status: "approved_seller",
    // };

    // await adminAuth.setCustomUserClaims(uid, newClaims);

    // update db entry
    await updateDoc(doc(FireData.db, "Seller", sellerId), {
      validated: true,
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

  if (!access) {
    return { error: "Access level is required." };
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
    const profileDoc = await getDoc(doc(FireData.db, collectionName, id));
    if (!profileDoc.exists) {
      return { error: "Seller/Buyer document not found." };
    }

    const profileData = profileDoc.data();
    const currentBannedStatus = profileData.banned || false;
    const newBannedStatus = !currentBannedStatus;

    // get user id from document
    const uid = id;
    if (!uid) {
      return {
        error: `UserID not found on ${collectionName} doc ${id}.`,
      };
    }

    // update document banned status
    await updateDoc(doc(FireData.db, collectionName, id), {
      banned: newBannedStatus,
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
