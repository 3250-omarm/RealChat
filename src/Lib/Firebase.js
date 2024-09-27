//Here will be the configuration of firebase as following
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCJaB0cy0ZqEthFHDq-a722Bf8SGo_UwK4",
  authDomain: "real-time-chat-2024.firebaseapp.com",
  projectId: "real-time-chat-2024",
  storageBucket: "real-time-chat-2024.appspot.com",
  messagingSenderId: "388454578040",
  appId: "1:388454578040:web:6a494d84aa0444cc053a8d",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
