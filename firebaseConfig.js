import firebase from "firebase/app";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX6ei3gj3e6R2QqfrMQDhri1xYgJlTT38",
  authDomain: "whatsapp-clone-e915f.firebaseapp.com",
  projectId: "whatsapp-clone-e915f",
  storageBucket: "whatsapp-clone-e915f.appspot.com",
  messagingSenderId: "1040894229392",
  appId: "1:1040894229392:web:4737988998424307865115",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("db", db);
// const colRef = collection(db, "users");
// console.log("colRef", colRef);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
