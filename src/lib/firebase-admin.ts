let adminDb: any = null;

if (typeof window === 'undefined') {
  // We MUST use Node's native module.createRequire to bypass Turbopack's require override.
  const moduleName = 'module';
  const { createRequire } = eval(`require('${moduleName}')`);
  
  // Create a require function that originates from the current working directory
  const nativeRequire = createRequire(process.cwd() + '/');
  
  // Obfuscate the package name so Turbopack's static analysis ignores it
  const adminPkg = 'firebase' + '-admin';
  const admin = nativeRequire(adminPkg);
  
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  adminDb = admin.firestore();
}

export { adminDb };
