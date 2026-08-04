import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6vWyFJlYp6v0LXdfp58ky9avazsjRM9Q",
  authDomain: "healingmilestones-6d4ef.firebaseapp.com",
  projectId: "healingmilestones-6d4ef",
  storageBucket: "healingmilestones-6d4ef.firebasestorage.app",
  messagingSenderId: "507010116072",
  appId: "1:507010116072:web:a21165283fcc477a5cdc5d",
  measurementId: "G-JTCGGV11NW"
};

// Initialize Firebase only once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
