"use server";
import { cookies } from "next/headers";

export const getDecodedToken = async () => {
  console.log("getDecodedToken: Starting...");
  try {
    console.log("getDecodedToken: Awaiting cookies...");
    const cookieStore = await cookies();
    console.log("getDecodedToken: Got cookie store");

    const sessionCookie = cookieStore.get("idToken");
    console.log("getDecodedToken: Session cookie exists?", !!sessionCookie);

    if (!sessionCookie) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const token = sessionCookie.value;
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));

    console.log("getDecodedToken: Verifying token...");
    const decodedToken = payload;
    if (!(!!decodedToken.user_id)) {
      throw new Error("Invalid Cookie: Logout, then Login.");
    }
    return decodedToken;
  } catch (error) {
    console.error("getDecodedToken: Error occurred:", error);
    throw error;
  }
};

export const verifyRole = async (requiredRole) => {
  try{
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
    if (requiredRole === "Seller" && decodedToken.status !== "approved") {
      throw new Error(`Forbidden: Seller account is not approved.`);
    }
    return true;
  } catch(error){
    console.error(error)
    return false
  }
};

export const getAuthUser = async () => {
  console.log("getAuthUser: Called");
  const decodedToken = await getDecodedToken();
  console.log("getAuthUser: Returning decoded token");
  return decodedToken;
};
