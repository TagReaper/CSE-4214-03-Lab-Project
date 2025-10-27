"use server";
import { adminDb } from "@/firebase/adminApp";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
