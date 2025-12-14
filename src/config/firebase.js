import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyANv2UXxunG5WF5rG1-ufvihaYVfVh_cUo",
    authDomain: "golang-toturial.firebaseapp.com",
    databaseURL: "https://golang-toturial-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "golang-toturial",
    storageBucket: "golang-toturial.firebasestorage.app",
    messagingSenderId: "592894761623",
    appId: "1:592894761623:web:719e5eaca89782eddaa7d2",
    measurementId: "G-3X4L2BCGSV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export default app;
