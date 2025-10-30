"use server";
import { adminDb } from "@/firebase/adminApp";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function validateAddress(address) {
  const trimmed = address.trim();
  if (trimmed.length < 5) {
    return "Address must be at least 5 characters long.";
  }
  if (trimmed.length > 100) {
    return "Address must be less than 100 characters.";
  }
  if (!/\d/.test(trimmed)) {
    return "Address must include a street number.";
  }
  return null;
}

function validateCity(city) {
  const trimmed = city.trim();
  if (trimmed.length < 2) {
    return "City must be at least 2 characters long.";
  }
  if (trimmed.length > 50) {
    return "City must be less than 50 characters.";
  }
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
    return "City can only contain letters, spaces, hyphens, and apostrophes.";
  }
  return null;
}

function validateState(state) {
  const trimmed = state.trim().toUpperCase();

  // List of valid US state abbreviations
  const validStates = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
    "DC", // Washington D.C.
  ];

  if (trimmed.length !== 2) {
    return "State must be a 2-letter abbreviation (e.g., MS, CA, NY).";
  }

  if (!validStates.includes(trimmed)) {
    return "Please enter a valid US state abbreviation.";
  }

  return null;
}

function validateZipCode(zipCode) {
  const trimmed = zipCode.trim();

  const zipRegex = /^\d{5}(-\d{4})?$/;

  if (!zipRegex.test(trimmed)) {
    return "Zip code must be 5 digits or 5+4 format (e.g., 12345 or 12345-6789).";
  }

  return null;
}

export async function updateAddressAction(previousState, formData) {
  let authenticatedUser;
  try {
    authenticatedUser = await getAuthUser();
  } catch (error) {
    return { error: error.message, success: null, data: null };
  }

  const rawAddress = {
    Address: formData.get("address")?.toString() || "",
    City: formData.get("city")?.toString() || "",
    State: formData.get("state")?.toString() || "",
    ZipCode: formData.get("zipCode")?.toString() || "",
  };

  if (
    !rawAddress.Address ||
    !rawAddress.City ||
    !rawAddress.State ||
    !rawAddress.ZipCode
  ) {
    return {
      error: "All address fields are required.",
      success: null,
      data: null,
    };
  }

  const addressError = validateAddress(rawAddress.Address);
  if (addressError) {
    return { error: addressError, success: null, data: null };
  }

  const cityError = validateCity(rawAddress.City);
  if (cityError) {
    return { error: cityError, success: null, data: null };
  }

  const stateError = validateState(rawAddress.State);
  if (stateError) {
    return { error: stateError, success: null, data: null };
  }

  const zipError = validateZipCode(rawAddress.ZipCode);
  if (zipError) {
    return { error: zipError, success: null, data: null };
  }

  const address = {
    Address: rawAddress.Address.trim(),
    City: rawAddress.City.trim(),
    State: rawAddress.State.trim().toUpperCase(),
    ZipCode: rawAddress.ZipCode.trim(),
  };

  try {
    const buyerDocRef = adminDb.collection("Buyer").doc(authenticatedUser.uid);

    const buyerSnapshot = await buyerDocRef.get();

    if (!buyerSnapshot.exists) {
      console.error("No buyer profile found for user:", authenticatedUser.uid);
      return {
        error: "Buyer profile not found for this user.",
        success: null,
        data: null,
      };
    }

    await buyerDocRef.update({
      Address: address.Address,
      City: address.City,
      State: address.State,
      ZipCode: address.ZipCode,
    });

    revalidatePath("/account/addresses");

    return {
      success: "Address has been updated.",
      error: null,
      data: address,
    };
  } catch (error) {
    console.error("Error updating address:", error);
    return {
      error: "Failed to update the address in the database.",
      success: null,
      data: null,
    };
  }
}
