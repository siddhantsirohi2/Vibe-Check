
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBzOi3nMdBhyVi4R6dCJz1eBmLh3vgjXgk",
    authDomain: "vibe-check-32e2c.firebaseapp.com",
    projectId: "vibe-check-32e2c",
    storageBucket: "vibe-check-32e2c.firebasestorage.app",
    messagingSenderId: "950085582208",
    appId: "1:950085582208:web:71ea7ae919f9ac72e01565",
    measurementId: "G-4DZNLHMHBB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

