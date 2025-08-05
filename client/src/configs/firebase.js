// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0ArOxBhY7Ul4xfOuc8kcAJhlO3xrfpG0",
  authDomain: "picachio-website.firebaseapp.com",
  projectId: "picachio-website",
  storageBucket: "picachio-website.firebasestorage.app",
  messagingSenderId: "80621108895",
  appId: "1:80621108895:web:e3bd82c77bece670fa6caa",
  measurementId: "G-ZY0P6ZHLXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();