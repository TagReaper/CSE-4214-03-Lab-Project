import { adminDb } from "@/firebase/adminApp";

async function globalTeardown() {
  console.log("cleaning up test data");

  try {
    const colRef = adminDb.collection("Inventory");

    const snapshot = await colRef
      .where("name", ">=", "Test Product")
      .where("name", "<=", "Test Product\uf8ff")
      .get();

    if (snapshot.empty) {
      console.log("no test data found");
      return;
    }

    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`deleted ${snapshot.size} test documents`);
  } catch (error) {
    console.error("error during teardown:", error);
  }
}

export default globalTeardown;
