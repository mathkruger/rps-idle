import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, where, addDoc, setDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

export {
    initializeApp,
    getFirestore,
    collection,
    getDocs,
    query, 
    where,
    addDoc,
    setDoc,
    doc,
    deleteDoc,
    getAuth,
    signInWithPopup,
    signOut,
    GoogleAuthProvider
};
