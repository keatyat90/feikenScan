// firebase.ts
import { initializeApp } from 'firebase/app'; // Import initializeApp from Firebase SDK
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc } from 'firebase/firestore'; // Firestore function

// Replace this with your Firebase project's configuration
const firebaseConfig = {
    apiKey: "AIzaSyClwJ-lJjLjgPs8CaiLYWqix9Dj94VpxwI", 
    authDomain: "feikenscan.firebaseapp.com", 
    projectId: "feikenscan", 
    storageBucket: "feikenscan.firebasestorage.app", 
    messagingSenderId: "873801766950", 
    appId: "1:873801766950:web:525450023f20befe2eeee7", 
    measurementId: "G-076T4JK9DY" 
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth services
const db = getFirestore(app);

export { db, doc, getDoc, getDocs, setDoc, collection, addDoc };
