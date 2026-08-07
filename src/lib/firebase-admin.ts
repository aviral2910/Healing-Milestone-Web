let adminDb: any = null;

if (typeof window === 'undefined') {
  const moduleName = 'module';
  const { createRequire } = eval(`require('${moduleName}')`);
  const nativeRequire = createRequire(process.cwd() + '/');
  const adminPkg = 'firebase' + '-admin';
  const admin = nativeRequire(adminPkg);
  
  console.log("FIREBASE-ADMIN: admin.apps =", admin.apps?.map((a: any) => a.name));
  
  const hasDefaultApp = admin.apps?.some((app: any) => app.name === '[DEFAULT]');
  
  if (!hasDefaultApp) {
    console.log("FIREBASE-ADMIN: initializing [DEFAULT] app...");
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'healingmilestones-6d4ef'
      });
      console.log("FIREBASE-ADMIN: initialized successfully");
    } catch (e) {
      console.error("FIREBASE-ADMIN: error during initializeApp:", e);
    }
  }
  
  try {
    adminDb = admin.firestore();
    console.log("FIREBASE-ADMIN: firestore initialized");
  } catch (e) {
    console.error("FIREBASE-ADMIN: error initializing firestore:", e);
  }
}

export { adminDb };
