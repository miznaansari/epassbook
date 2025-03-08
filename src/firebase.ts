import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1ZgLcrv4vzEnyaDUn_ONzQaQ29kof_xc",
  authDomain: "e-passbook-9745b.firebaseapp.com",
  projectId: "e-passbook-9745b",
  storageBucket: "e-passbook-9745b.firebasestorage.app",
  messagingSenderId: "187068233174",
  appId: "1:187068233174:web:8ac0d4b1efb770b5d32077",
  measurementId: "G-33F3PXFY9E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
