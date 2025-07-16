// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4xMse2TdejBR0wpagrdWRDCs9dDMg45c",
  authDomain: "beauty-website-008.firebaseapp.com",
  projectId: "beauty-website-008",
  storageBucket: "beauty-website-008.firebasestorage.app",
  messagingSenderId: "1074532082282",
  appId: "1:1074532082282:web:8ff4b9afe169834cb6e013",
  measurementId: "G-LFB13H9CJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);