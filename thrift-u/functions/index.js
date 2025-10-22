/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const roles = {
    seller: 1,
    buyer: 2,
    admin: 0,
};

// assign customclaims role to user on signup
exports.registerUser = functions.https.onCall(async (request) => {
    const { email, password, role, firstName, lastName } = request.data;

    if (!["buyer", "seller"].includes(role)) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "A valid role ('buyer' or 'seller') must be provided.",
        );
    }

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: `${firstName} ${lastName}`,
        });
        // create user document in firestore
        await db
            .collection("User")
            .doc(userRecord.uid)
            .set({
                email: email,
                firstName: firstName,
                lastName: lastName,
                accessLevel: role === "seller" ? roles.seller : roles.buyer,
                dateCreated: FieldValue.serverTimestamp(),
                deletedAt: null,
            });

        let claims = {};
        if (role === "seller") {
            claims = { role: "seller", status: "pending_seller" };
            // create seller document in firestore
            await db.collection("Seller").doc(userRecord.uid).set({
                UserID: userRecord.uid,
                banned: false,
                validated: false,
                Flags: 0,
            });

            // create an application document in firestore for admins
            await db.collection("sellerApplications").doc(userRecord.uid).set({
                email: email,
                firstName: firstName,
                lastName: lastName,
                status: "pending",
                submittedAt: FieldValue.serverTimestamp(),
                deletedAt: null,
            });
            // db document for buys will be done in seperate function
        } else {
            await db.collection("Buyer").doc(userRecord.uid).set({
                UserID: userRecord.uid,
                banned: false,
                address: null,
                city: null,
                state: null,
                zip: null,
                numOrders: 0,
            });
            claims = { role: "buyer" };
        }
        // set the custom claims on the user's account
        await admin.auth().setCustomUserClaims(userRecord.uid, claims);

        return { uid: userRecord.uid, message: "User created successfully." };
    } catch (error) {
        if (error.code === "auth/email-already-exists") {
            throw new functions.https.HttpsError(
                "already-exists",
                "This email is already in use.",
            );
        }

        console.error("Error creating user:", error);
        throw new functions.https.HttpsError(
            "internal",
            "An unexpected error occurred during registration.",
        );
    }
});

// approve seller account and update custom claims
exports.approveSeller = functions.https.onCall(async (data, context) => {
    if (context.auth.token.role !== "admin") {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Only an admin can change user roles.",
        );
    }

    const { uid } = data;

    if (!uid || typeof uid !== "string" || uid.length === 0) {
        // check if argument is valid string
        throw new functions.https.HttpsError(
            "invalid-argument",
            "A valid user ID (UID) must be provided.",
        );
    }

    try {
        const userRecord = await admin.auth().getUser(uid);
        const customClaims = userRecord.customClaims || {};

        if (
            customClaims.role !== "seller" ||
            customClaims.status !== "pending_seller"
        ) {
            // check if uid is a seller
            throw new functions.https.HttpsError(
                "failed-precondition",
                "This user is not a pending seller and cannot be approved.",
            );
        }

        const newClaims = {
            // merging old custom claims with new status
            ...customClaims,
            status: "approved_seller",
        };

        await admin.auth().setCustomUserClaims(uid, newClaims);

        await db.collection("sellerApplications").doc(uid).update({
            // update database field for seller application
            status: "approved",
            approvedAt: FieldValue.serverTimestamp(),
        });

        return {
            message: `Success! User ${uid} has been approved as a seller.`,
        };
    } catch (error) {
        console.error("Error setting user role:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Failed to update user role.",
        );
    }
});
