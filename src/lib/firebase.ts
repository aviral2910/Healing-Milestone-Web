import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDblAVFfarIEkqtJTkiZqaIZYfY1vKeH20",
  projectId: "healingmilestones-6d4ef",
  storageBucket: "healingmilestones-6d4ef.firebasestorage.app",
  appId: "1:507010116072:android:3de0d8fcb92512de5cdc5d",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db };
