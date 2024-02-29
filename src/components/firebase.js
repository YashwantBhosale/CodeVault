// import firebase from "firebase/compat/app";
// import initializeApp from "firebase/app/dist/"
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAdm-XsMxAmWc8JWbSqyZbsfK0QxUGzG5s",
    authDomain: "codevault-a6425.firebaseapp.com",
    projectId: "codevault-a6425",
    storageBucket: "codevault-a6425.appspot.com",
    messagingSenderId: "760155658448",
    appId: "1:760155658448:web:dd4934e35e5cd17923e6d5",
    measurementId: "G-8366BT0M6E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };