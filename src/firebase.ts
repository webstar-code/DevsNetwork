import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwI1_RtMTJSDklVNbihpcm2yw__4QVPv8",
  authDomain: "devsnetwork-01.firebaseapp.com",
  projectId: "devsnetwork-01",
  storageBucket: "devsnetwork-01.appspot.com",
  messagingSenderId: "267363641842",
  appId: "1:267363641842:web:456bf03b374829d1d2636b",
  measurementId: "G-8LFX8PQQVJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth()
export const db = getFirestore(app);

export const dbCollections = {
  "users": "users"
}