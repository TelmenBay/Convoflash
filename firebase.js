// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCv2aWayBMaFYkMv0BbpQNvQnJlNuaQ5dQ",
  authDomain: "convoflash.firebaseapp.com",
  projectId: "convoflash",
  storageBucket: "convoflash.appspot.com",
  messagingSenderId: "384584383759",
  appId: "1:384584383759:web:ee98441e4c68f0de87d27a",
  measurementId: "G-N7SXWF3BTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);