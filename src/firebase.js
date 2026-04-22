import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Please provide a placeholder for the firebaseConfig object so I can paste my API keys there later.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "undangan-shenny.firebaseapp.com",
  databaseURL: "https://undangan-shenny-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "undangan-shenny",
  storageBucket: "undangan-shenny.appspot.com",
  messagingSenderId: "185891879697",
  appId: "1:185891879697:web:8eebc73ed519b6ff0deab0"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
