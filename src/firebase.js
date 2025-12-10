// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1gSorRWoywSjGLiwDGxVbIOmw4DOYnp8",
  authDomain: "chat-app-1124.firebaseapp.com",
  projectId: "chat-app-1124",
  storageBucket: "chat-app-1124.firebasestorage.app",
  messagingSenderId: "881734545252",
  appId: "1:881734545252:web:900c50c01583f5b30c5471",
  measurementId: "G-Q906MYWE37"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
