// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvqQ_L5hYkV9bUaWGRqVswvYFVELoLN60",
  authDomain: "investhup-b9a2c.firebaseapp.com",
  projectId: "investhup-b9a2c",
  storageBucket: "investhup-b9a2c.appspot.com", 
  messagingSenderId: "827772456439",
  appId: "1:827772456439:web:8a939cd78725c8a482b2f2",
  measurementId: "G-C71QXWTY1N",
};

// Initialize Firebase once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = typeof window !== "undefined" ? getAuth(app) : null;
const db = typeof window !== "undefined" ? getFirestore(app) : null;

export function getFirebaseAuth() {
  if (typeof window === "undefined") return null;
  return auth;
}

export function getFirebaseDb() {
  if (typeof window === "undefined") return null;
  return db;
}
