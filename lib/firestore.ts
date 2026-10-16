import "server-only";

import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { adminApp, firebaseAdminConfigured } from "@/lib/firebase/admin";

/** Primary store for users, products, article metadata, orders, contacts and donations. */
let cachedFirestore: Firestore | null = null;

export function firestore(): Firestore {
  if (!cachedFirestore) cachedFirestore = getFirestore(adminApp());
  return cachedFirestore;
}

export function firestoreConfigured(): boolean {
  return firebaseAdminConfigured();
}
