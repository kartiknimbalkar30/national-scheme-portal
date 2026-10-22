import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCm6qW2F7BSOaneGNXiXvNykVLR1rOD3cM",
  authDomain: "national-scheme-portal.firebaseapp.com",
  projectId: "national-scheme-portal",
  storageBucket: "national-scheme-portal.firebasestorage.app",
  messagingSenderId: "951099390062",
  appId: "1:951099390062:web:ba1fde8a3f425023254e7f",
  measurementId: "G-V16MBKPPYK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
