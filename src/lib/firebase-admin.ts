import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (typeof window === "undefined" && !getApps().length) {
  initializeApp();
}

const adminDb = typeof window === "undefined" ? getFirestore() : null as any;

export { adminDb };
