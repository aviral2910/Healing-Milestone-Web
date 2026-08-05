const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "healingmilestones-6d4ef"
});

const db = admin.firestore();

async function check() {
  const doc = await db.collection('users').doc('OFvEE3ZRaAgf0xrTvETjDm0JeuH2').get();
  console.log("Exists:", doc.exists);
  if (doc.exists) {
    console.log(doc.data());
  }
}
check();
