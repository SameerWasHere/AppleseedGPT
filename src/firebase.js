// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbhWP3vszVRDv0MB9qs6G01BtbpZaDe8A",
  authDomain: "personal-chat-app-396c3.firebaseapp.com",
  projectId: "personal-chat-app-396c3",
  storageBucket: "personal-chat-app-396c3.appspot.com",
  messagingSenderId: "1036217856387",
  appId: "1:1036217856387:web:bbf14c3228de5d983d86b6",
  measurementId: "G-DSHD0PR53Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Function to handle Google Sign-In
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};
