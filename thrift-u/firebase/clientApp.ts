import { initializeApp } from "firebase/app"
import {getFirestore} from "@firebase/firestore";
import "firebase/auth"
import "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
import { initialize } from "next/dist/server/lib/render-server";
import { firebaseConfig } from "firebase-functions/v1";

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SEND_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(clientCredentials);
const db = getFirestore(app)

export default db