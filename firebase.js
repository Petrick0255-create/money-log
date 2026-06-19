import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  doc,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSVIFQy4izTG62HelbHNGh7MaV_gpdNHM",
  authDomain: "money-log-f1bfc.firebaseapp.com",
  projectId: "money-log-f1bfc",
  storageBucket: "money-log-f1bfc.firebasestorage.app",
  messagingSenderId: "212358025563",
  appId: "1:212358025563:web:e03df1f2d75a58f4144a7e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot
};