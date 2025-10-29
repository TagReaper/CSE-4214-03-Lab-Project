//import { serverConfig } from "../config/config";
import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/adminApp";

const getDecodedToken = async () => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("FireToken");

  if (!sessionCookie) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  const token = sessionCookie.value;

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Firebase Auth Error:", error.message);
    throw new Error("Unauthorized: Session is invalid or expired.");
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
  const decodedToken = await getDecodedToken();

  return decodedToken;
};
