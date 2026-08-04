// Use a dynamic import trick to prevent Next.js from trying to bundle firebase-admin
const admin = typeof window === 'undefined' ? eval(`require('firebase-admin')`) : null;

if (admin && !admin.apps.length) {
  admin.initializeApp();
}

const adminDb = admin ? admin.firestore() : null;

export { adminDb };
