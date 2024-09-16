import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuD6wpqQf_jKU-ve_irsXftytFKPzVZg4",
  authDomain: "chat-app-6823e.firebaseapp.com",
  projectId: "chat-app-6823e",
  storageBucket: "chat-app-6823e.appspot.com",
  messagingSenderId: "40243276017",
  appId: "1:40243276017:web:4230362dbee4d66d7b6150",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const realtimeDb = getDatabase(app);
auth.settings.appVerificationDisabledForTesting = true;

export { auth, firestore, realtimeDb };
