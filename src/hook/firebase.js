
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from "../lib/firebase";
import { api } from "../lib/api";

export default function useFirebase() {
    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();

    const loginWithEmailPassword = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            const res = await api.fetch('/user/profile', {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
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

            const res = await api.fetch('/user/profile', {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
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

            const res = await api.fetch('/user/profile', {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
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