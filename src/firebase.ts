// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYD_3tti-w9cS6NIdmlGUOTa57PeVvydI",
  authDomain: "mesh-8a8bb.firebaseapp.com",
  projectId: "mesh-8a8bb",
  storageBucket: "mesh-8a8bb.firebasestorage.app",
  messagingSenderId: "449289683076",
  appId: "1:449289683076:web:034aeb5a6bbbfb88b702d1",
  measurementId: "G-HG7Z20WHKP"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Analytics support check
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics error if blocked
  });
}

export { app, db, analytics };
