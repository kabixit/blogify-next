// firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB7tYHXU5axAqVq-goK8dilfs1e7xeQEN8",
  authDomain: "blogifynext.firebaseapp.com",
  projectId: "blogifynext",
  storageBucket: "blogifynext.appspot.com",
  messagingSenderId: "445390932974",
  appId: "1:445390932974:web:7befda91182d3f28a59cff",
  measurementId: "G-8FVLXDPCZV"
};

// Import the functions you need from the SDKs you need


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};
