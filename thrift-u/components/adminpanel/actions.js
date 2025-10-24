"use server";
import { adminDb } from "@/firebase/adminApp";
import { verifyUserAndCheckRole } from "@/lib/auth";
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
  revalidatePath("/admin/products");

  return { success: `Product ${productId} has been approved.` };
}
