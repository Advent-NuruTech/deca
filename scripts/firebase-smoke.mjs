import { cert, deleteApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function credentialFromEnvironment() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON");
    }
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Set FIREBASE_SERVICE_ACCOUNT_KEY, or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY",
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

let app;

try {
  const credential = credentialFromEnvironment();
  app = initializeApp({ credential: cert(credential) }, "phase8-smoke");

  await getAuth(app).listUsers(1);
  console.log("Firebase Authentication access ok");

  await getFirestore(app).listCollections();
  console.log("Cloud Firestore access ok");
} catch (error) {
  console.error(
    "Firebase smoke test FAILED:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
} finally {
  if (app) await deleteApp(app);
}
