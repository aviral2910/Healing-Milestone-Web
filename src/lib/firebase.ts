import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDblAVFfarIEkqtJTkiZqaIZYfY1vKeH20",
  projectId: "healingmilestones-6d4ef",
  authDomain: "healingmilestones-6d4ef.firebaseapp.com",
  storageBucket: "healingmilestones-6d4ef.firebasestorage.app",
  appId: "1:507010116072:android:3de0d8fcb92512de5cdc5d",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
