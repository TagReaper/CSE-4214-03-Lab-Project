import { initializeApp } from "firebase/app"
import {getFirestore} from "@firebase/firestore";
import "firebase/auth"
import "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
import { initialize } from "next/dist/server/lib/render-server";
import { firebaseConfig } from "firebase-functions/v1";

const clientCredentials = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SEND_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(clientCredentials);
const db = getFirestore(app)

export default db