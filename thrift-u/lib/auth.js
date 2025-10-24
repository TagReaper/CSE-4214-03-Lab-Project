import { getTokens } from "next-firebase-auth-edge";
import { serverConfig } from "../config/config";
import { cookies } from "next/headers";

export const verifyUserAndCheckRole = async (requiredRole) => {
  if (!requiredRole) {
    throw new Error(
      "A required role must be provided to the verification function."
    );
  }

  const tokens = await getTokens(cookies(), { ...serverConfig });
  //no cookies returned
  if (!tokens) {
    throw new Error("Unauthorized: You must be logged in.");
  }
  //role doesn't match
  if (tokens.decodedToken.role !== requiredRole) {
    throw new Error(
      `Forbidden: This action requires the "${requiredRole}" role.`
    );
  }

  //seller status check
  if (
    requiredRole === "seller" &&
    tokens.decodedToken.status !== "approved_seller"
  ) {
    throw new Error(`Forbidden: Seller account is not approved.`);
  }

  return tokens.decodedToken;
};
