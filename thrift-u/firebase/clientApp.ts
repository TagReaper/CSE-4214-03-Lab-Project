import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

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
const auth = getAuth(app);
const db = getFirestore(app);

if (process.env.FIRESTORE_EMULATOR_HOST) {
    connectFirestoreEmulator(db, "127.0.0.1", 8081);
}

if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}

const FireData = {
    app: app,
    auth: auth,
    db: db
}

export default FireData;