
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup }from 'firebase/auth'
import { initializeApp } from "firebase/app";

export default function useFirebase() {
    const app = initializeApp({
        apiKey: "AIzaSyBl9JFXJ3n8Y-jKFJqnO98F6jubass0lGk",
        authDomain: "golang-tutorial-2.firebaseapp.com",
        projectId: "golang-tutorial-2",
        storageBucket: "golang-tutorial-2.firebasestorage.app",
        messagingSenderId: "249706562020",
        appId: "1:249706562020:web:88ead84f121ce76aac87f1",
        measurementId: "G-NJ857P05GV"
    });

    const auth = getAuth(app);

    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();

    const loginWithEmailPassword = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/user/profile`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error during email/password login:", error);
            throw error;
        }
    }

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();

            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/user/profile`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error during Google login:", error);
            throw error;
        }
    }

    const loginWithFacebook = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const token = await result.user.getIdToken();

            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/user/profile`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error during Facebook login:", error);
            throw error;
        }
    }
    return { loginWithEmailPassword, loginWithGoogle, loginWithFacebook, auth }
}