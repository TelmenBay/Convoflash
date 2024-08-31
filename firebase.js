// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Optional: Import only analytics when in the browser.
import { getAnalytics } from 'firebase/analytics'; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCv2aWayBMaFYkMv0BbpQNvQnJlNuaQ5dQ",
  authDomain: "convoflash.firebaseapp.com",
  projectId: "convoflash",
  storageBucket: "convoflash.appspot.com",
  messagingSenderId: "384584383759",
  appId: "1:384584383759:web:ee98441e4c68f0de87d27a",
  measurementId: "G-N7SXWF3BTS"
};

// Initialize Firebase only on the client-side
const app = initializeApp(firebaseConfig);

// Check for `window` to ensure analytics is only used client-side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const db = getFirestore(app);

export default db;
