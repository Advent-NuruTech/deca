import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

function splitServiceAccount(): ServiceAccount | null {
  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

function serviceAccountCredential(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw) {
    try {
      return JSON.parse(raw) as ServiceAccount;
    } catch {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON. Paste the whole service account file contents as one line.",
      );
    }
  }

  const split = splitServiceAccount();
  if (split) {
    return split;
  }

  throw new Error(
    "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY, or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
  );
}

export function firebaseAdminConfigured(): boolean {
  try {
    serviceAccountCredential();
    return true;
  } catch {
    return false;
  }
}

function buildAdminApp(): App {
  const existing = getApps();
  if (existing.length) {
    return existing[0];
  }

  const serviceAccount = serviceAccountCredential();

  return initializeApp({
    credential: cert(serviceAccount),
    projectId:
      process.env.FIREBASE_PROJECT_ID ??
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
      serviceAccount.projectId,
  });
}

let cachedApp: App | null = null;

export function adminApp(): App {
  if (!cachedApp) {
    cachedApp = buildAdminApp();
  }
  return cachedApp;
}

let cachedAuth: Auth | null = null;

export function adminAuth(): Auth {
  if (!cachedAuth) {
    cachedAuth = getAuth(adminApp());
  }
  return cachedAuth;
}
