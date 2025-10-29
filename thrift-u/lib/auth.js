//import { serverConfig } from "../config/config";
import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/adminApp";

const getDecodedToken = async () => {
  console.log("getDecodedToken: Starting...");
  try {
    console.log("getDecodedToken: Awaiting cookies...");
    const cookieStore = await cookies();
    console.log("getDecodedToken: Got cookie store");

    const sessionCookie = cookieStore.get("FireToken");
    console.log("getDecodedToken: Session cookie exists?", !!sessionCookie);

    if (!sessionCookie) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const token = sessionCookie.value;
    console.log("getDecodedToken: Token length:", token?.length);

    console.log("getDecodedToken: Verifying token...");
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log(
      "getDecodedToken: Token verified successfully. UID:",
      decodedToken.uid
    );
    return decodedToken;
  } catch (error) {
    console.error("getDecodedToken: Error occurred:", error);
    throw error;
  }
};

export const verifyRole = async (requiredRole) => {
  if (!requiredRole) {
    throw new Error(
      "A required role must be provided to the verification function."
    );
  }

  const decodedToken = await getDecodedToken();
  // role doesn't match
  if (decodedToken.role !== requiredRole) {
    throw new Error(
      `Forbidden: This action requires the "${requiredRole}" role.`
    );
  }

  // seller status check
  if (requiredRole === "seller" && decodedToken.status !== "approved_seller") {
    throw new Error(`Forbidden: Seller account is not approved.`);
  }

  return decodedToken;
};

export const getAuthUser = async () => {
  console.log("getAuthUser: Called");
  const decodedToken = await getDecodedToken();
  console.log("getAuthUser: Returning decoded token");
  return decodedToken;
};
