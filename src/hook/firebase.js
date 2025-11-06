
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup }from 'firebase/auth'
import { initializeApp } from "firebase/app";

export default function useFirebase() {
    const app = initializeApp({
        // apiKey: "AIzaSyANv2UXxunG5WF5rG1-ufvihaYVfVh_cUo",
        // authDomain: "golang-toturial.firebaseapp.com",
        // databaseURL: "https://golang-toturial-default-rtdb.asia-southeast1.firebasedatabase.app",
        // projectId: "golang-toturial",
        // storageBucket: "golang-toturial.firebasestorage.app",
        // messagingSenderId: "592894761623",
        // appId: "1:592894761623:web:719e5eaca89782eddaa7d2",
        // measurementId: "G-3X4L2BCGSV"
    });

    const auth = getAuth(app);

    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();

    const loginWithEmailPassword = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            const res = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();

            return data;
        } catch (error) {
            console.error("Error during email/password login:", error);
        }
    }

    const loginWithGoogle = async () => {
        try {

            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();

            const res = await fetch("http://localhost:3000/user/profile", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();

            return data;
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    }

    const loginWithFacebook = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const token = await result.user.getIdToken();

            const res = await fetch("http://localhost:3000/user/profile", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error during Facebook login:", error);
        }
    }
    return { loginWithEmailPassword, loginWithGoogle, loginWithFacebook, auth }
}