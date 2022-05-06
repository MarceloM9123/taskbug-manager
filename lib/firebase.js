import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyBJ7I2TdzN6riCgj-Df6ad4iViGUL3R_iQ",
  authDomain: "taskbug-manager.firebaseapp.com",
  projectId: "taskbug-manager",
  storageBucket: "taskbug-manager.appspot.com",
  messagingSenderId: "1044033285055",
  appId: "1:1044033285055:web:70c95242e792f8d39c0f0a",
  measurementId: "G-GF4V13DZFR"
  };

// Initialize firebase
const firebaseApp = initializeApp(config);

// Initialize auth && firestore with the 'firebaseApp' property
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

export default firebaseApp;