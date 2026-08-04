const { createRequire } = require('module');
const nativeRequire = createRequire(process.cwd() + '/');
const adminPkg = 'firebase' + '-admin';
const admin = nativeRequire(adminPkg);
console.log("admin.apps.length:", admin.apps.length);
if (!admin.apps.length) { admin.initializeApp(); }
console.log("admin.apps.length after:", admin.apps.length);
try {
  const db = admin.firestore();
  console.log("Firestore OK!");
} catch (e) {
  console.error("Firestore error:", e);
}
