// firebase.ts
import { initializeApp } from 'firebase/app'; // Import initializeApp from Firebase SDK
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc } from 'firebase/firestore'; // Firestore function
import { getAnalytics } from "firebase/analytics";
// import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from '@env';

// Replace this with your Firebase project's configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY, 
    authDomain: process.env.AUTH_DOMAIN, 
    projectId: process.env.PROJECT_ID, 
    storageBucket: process.env.STORAGE_BUCKET, 
    messagingSenderId: process.env.MESSAGING_SENDER_ID, 
    appId: process.env.APP_ID, 
    measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and Auth services
const db = getFirestore(app);

export { db, doc, getDoc, getDocs, setDoc, collection, addDoc };
