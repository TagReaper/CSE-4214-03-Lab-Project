"use server";
import { getDoc, doc, updateDoc } from "@firebase/firestore";
import FireData from "@/firebase/clientApp";
//import { verifyUserAndCheckRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { verifyRole } from "../../lib/auth";
import { NotificationService } from "@/lib/notifications/service";
import { NotificationType } from "@/lib/notifications/types";

const notifService = NotificationService.getInstance();

async function getProductName(productId) {
  try {
    const productRef = adminDb.collection("products").doc(productId);

    const docSnap = await productRef.get();

    if (!docSnap.exists) {
      console.error(`Error: Product not found with ID: ${productId}`);
      return "Product Not Found";
    }

    const data = docSnap.data();
    return data?.name || "Unnamed Product";
  } catch (error) {
    console.error("Error fetching product name:", error);
    return "Error: See Logs";
  }
}

export async function approveProduct(productId) {
  if (!(await verifyRole("Admin"))) {
    return { error: "Invalid Access." };
  }

  if (!productId) {
    return { error: "Product ID is required." };
  }

  // pull product from db
  try {
    // update db entry
    await updateDoc(doc(FireData.db, "Inventory", productId), {
      approved: true,
    });

    const productName = await getProductName(productId);

    await notifService.sendNotification(
      sellerId,
      NotificationType.ITEM_APPROVED,
      { itemId: productId, itemName: productName }
    );
  } catch (error) {
    console.error("Error approving product:", error);
    return { error: "Failed to update the product in the database." };
  }

  // refresh data on page
  location.reload();
  // revalidatePath("/adminpanel");

  return { success: `Product ${productId} has been approved.` };
}

export async function denyProduct(productId) {
  if (!(await verifyRole("Admin"))) {
    return { error: "Invalid Access." };
  }

  if (!productId) {
    return { error: "Product ID is required." };
  }

  // pull product from db
  try {
    // update db entry
    const date = new Date();
    await updateDoc(doc(FireData.db, "Inventory", productId), {
      deletedAt: date.toLocaleString(),
    });
  } catch (error) {
    console.error("Error denying product:", error);
    return { error: "Failed to update the product in the database." };
  }

  // refresh data on page
  location.reload();

  return { success: `Product ${productId} has been denied.` };
}

export async function approveSeller(sellerId) {
  if (!(await verifyRole("Admin"))) {
    return { error: "Invalid Access." };
  }

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

    // update db entry
    await updateDoc(doc(FireData.db, "Seller", sellerId), {
      validated: true,
    });

    await notifService.sendNotification(
      sellerId,
      NotificationType.SELLER_APPLICATION_APPROVED
    );
  } catch (error) {
    console.error("Error approving seller:", error);
    if (error.code === "auth/user-not-found") {
      return { error: "Firebase Auth user not found. Cannot set claims." };
    }
    return { error: "Failed to update the seller in the database." };
  }

  location.reload();
  return { success: `UserID: ${sellerId} has been approved to be a seller.` };
}

export async function denySeller(sellerId) {
  if (!(await verifyRole("Admin"))) {
    return { error: "Invalid Access." };
  }

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

    // update db entry
    const date = new Date();
    await updateDoc(doc(FireData.db, "Seller", sellerId), {
      deletedAt: date.toLocaleString(),
    });
  } catch (error) {
    console.error("Error denying seller:", error);
    return { error: "Failed to update the seller in the database." };
  }

  location.reload();
  return { success: `UserID: ${sellerId} has been denied seller access.` };
}

export async function toggleBanStatus(id, access) {
  if (!(await verifyRole("Admin"))) {
    return { error: "Invalid Access." };
  }

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

    if (newBannedStatus == "banned") {
      await notifService.sendNotification(
        userId,
        NotificationType.SYSTEM_WARNING,
        {
          action: "Ban",
          reason: "Violation of guidelines",
        }
      );
    }

    return {
      success: `User has been ${newBannedStatus ? "banned" : "unbanned"}.`,
      newBannedStatus: newBannedStatus,
    };
  } catch (error) {
    console.error("Error toggling ban status:", error);
    return { error: "A server error occurred." };
  }
}
