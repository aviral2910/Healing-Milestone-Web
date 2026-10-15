const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, getDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDblAVFfarIEkqtJTkiZqaIZYfY1vKeH20",
  projectId: "healingmilestones-6d4ef",
  authDomain: "healingmilestones-6d4ef.firebaseapp.com",
  storageBucket: "healingmilestones-6d4ef.firebasestorage.app",
  appId: "1:507010116072:android:3de0d8fcb92512de5cdc5d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const RIDDLE_ANSWERS = {
  yellow: [
    { step: 1, answer: "The Speakers / DJ" },
    { step: 2, answer: "The Haldi Bowl" },
    { step: 3, answer: "The Photographer (or Camera)" },
    { step: 4, answer: "Pani Puri / Chaat Stall" },
    { step: 5, answer: "The Ice Cooler / Drinks Station" },
    { step: 6, answer: "Aviral (The Brother)" },
    { step: 7, answer: "The Dessert Table" },
    { step: 8, answer: "The Welcome Sign / Floral Entrance" }
  ],
  green: [
    { step: 1, answer: "The Mehndi Cones / The Artist" },
    { step: 2, answer: "The Lemon & Sugar Mixture" },
    { step: 3, answer: "The Bangle Stall / Box" },
    { step: 4, answer: "The Chai / Tea Counter" },
    { step: 5, answer: "The Dholki / Hand Drum" },
    { step: 6, answer: "The Groom" },
    { step: 7, answer: "Marigold (Genda Phool) Decorations" },
    { step: 8, answer: "The Photographer's Lighting Umbrella" }
  ],
  pink: [
    { step: 1, answer: "The Floral Backdrop / Stage Wall" },
    { step: 2, answer: "The Bride's Sister" },
    { step: 3, answer: "Traditional Umbrella Decor" },
    { step: 4, answer: "The Groom's Mother" },
    { step: 5, answer: "The Puja Thali / Sacred Plate" },
    { step: 6, answer: "The Groom's Best Friend / Brother" },
    { step: 7, answer: "The Bride Herself!" },
    { step: 8, answer: "The Bride's Mother" }
  ],
  red: [
    { step: 1, answer: "The Bride's Father" },
    { step: 2, answer: "The Groom's Father" },
    { step: 3, answer: "The Videographer" },
    { step: 4, answer: "The Bride's Maternal Uncle (Mama)" },
    { step: 5, answer: "The Bride's Best Friend / Bridesmaid" },
    { step: 6, answer: "The Groom's Shoes" },
    { step: 7, answer: "The Grandparents (or Eldest Relative)" },
    { step: 8, answer: "The Couple's Seating (Main Thrones)" }
  ]
};

async function updateAllRiddleAnswers() {
  console.log("Starting update of all 32 riddle answers in Firestore (wedding_quest_riddles)...");
  let updatedCount = 0;

  for (const [round, riddles] of Object.entries(RIDDLE_ANSWERS)) {
    for (const r of riddles) {
      const docId = `${round}_${r.step}`;
      const docRef = doc(db, "wedding_quest_riddles", docId);

      await setDoc(docRef, {
        answer: r.answer,
        hint: r.answer
      }, { merge: true });

      const verifyDoc = await getDoc(docRef);
      const data = verifyDoc.data();
      console.log(`✅ [${docId}] -> answer: "${data.answer}" (secret: ${data.secret})`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} riddle documents with their answers!`);
  process.exit(0);
}

updateAllRiddleAnswers().catch((err) => {
  console.error("❌ Failed to update riddle answers:", err);
  process.exit(1);
});
