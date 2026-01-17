import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

/**
 * PROJECT SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console (console.firebase.google.com)
 * 2. Create a Project named "AXORA-Marketplace"
 * 3. Add a Web App and copy the config object below.
 * 4. Enable "Authentication" (Email/Password) and "Cloud Firestore" (Test Mode).
 */
const firebaseConfig = {
  apiKey: "AIzaSyA_BSlHBrAbiXcjux0x5I-JmTYUj9wXZKU",
  authDomain: "ecommerce-84330.firebaseapp.com",
  projectId: "ecommerce-84330",
  storageBucket: "ecommerce-84330.firebasestorage.app",
  messagingSenderId: "532415346310",
  appId: "1:532415346310:web:3caa85a237b85521a84307",
  measurementId: "G-3LE4F10W6Q"
};

// Check if the user has actually provided real configuration values
export const isFirebaseConfigured =
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes("REPLACE_WITH") &&
  firebaseConfig.apiKey !== "REPLACE_WITH_YOUR_API_KEY";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const googleProvider = new GoogleAuthProvider();

if (!isFirebaseConfigured) {
  console.warn("AXORA: Firebase is not configured. Entering 'Maison Simulation Mode' for local persistence.");
}

export { auth, db, storage, analytics, googleProvider };
