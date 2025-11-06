
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup }from 'firebase/auth'
import { initializeApp } from "firebase/app";

const config = {
    "type": "service_account",
    "project_id": "golang-toturial",
    "private_key_id": "e77442479df32e6371b1da3874485ec7f40b7f59",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6uR+zeCZ3ERbY\nzVx/BnjSHa/Hx0rK7BK/TS9AqPDzcpY14Gpi4t1Cpz0VuGUXXXNC9YcvZiUeSkB8\nhqi0vs0H9TZ84+FkcJbrvXnxBia6YN/VB2kC769qce9bfZxewMz6c9K3lCJTa86s\ntvfQomVPSuqQHg1Mic15heMMgYjizMaCoSWw4mGzv0qFtsd82uFiRBldK6PcmczB\n00VYN+kPblkmgkqYrLR0UXnt8kkIS8oONPR1Qi2RWfHhxzhIGnPAj5k7Z8B0gYm0\nKD/n2bPLH2G+4qQ/oiXf8tMiinj6AC21TvH4mku7RFsA2JvJ8WPNBbirAVS4f65z\ncE2tTw8RAgMBAAECggEAEAFz6fSr6Wtt16481kel/i7cxUV8UAot7jeNzB9fLiMd\npKckv26+dCr1RcIdakQQsAXvbVz2ZBMN1Y7OcdXkKeE3Zzu6c5tiGHmQtRwnoDTT\nIwXkVsPYd8ml8KQDDi09NN/OSX25doioee4iLoBpKkOb+TgWQEAUvKzBIm6NHxG0\nUnHQXV8bIdHDJQg2t4GmeU/Lk6ILE34N3qqIGX+Y+Ur04rziDCsLCC8tb4z+lcIC\n8aA261qdc0xh3antHNZGjO37vuHcp5TiPHGoH5NGRCISlpO+Lcv6JkIev+wbGez9\npAYEYarcp5TKvRJ99Ath69cx2PeAKFsJmptCx39UBQKBgQD3aOpZs5+7krfr7CRC\nC7h4zzGG5RJ6ViYPpLQ3knO8yTWcDkgVgzJE1qedwD14krAhP8qI5Bn8yfWlXp1z\nECX4XqpMLmwYq27Amh6FQ7E+lqzkipqWKSdCVfp6RiPh83tXutN4qSggat2yAXJO\nFp30ZUx9DxXJCe3culrlyf0kvQKBgQDBNMyTlpHtzWm1/UwJQQqfNugbK6kqLzD5\nSkNCIYMfjc27hmcr+p9COrXfp3vHBr5c8An+CWoMQjLh3YyNn20q3M6zpV0a1yoC\n/qHzusytDg/dqEmGPgcNf3/iA0ov/Zgqc/EJeTjxC1HPCxPpfaEcTGNEpbaQpOlK\n2jr+p8oa5QKBgFLdItCUZsVuKIet+Z7dShW8X3wssPmkbO8EXQ/Xz0fFpFz2M5Jw\n9J81vcIKJwyBJNieAvnCXCncgpe2jsmA+RasriEB01aX5GpBtEMyHuU1lgadnZT5\nh5qiLVhSsaX15LPHcRiSn0vsPwBll6Er1g+K9glUyhkhaDdrexJHiq+JAoGBAK6v\nBEB0pKAzVt6ak8LSMb5eMGFQinR/knHyePkzv5Ap79ca3/FdedyxpHsAvOLn7/mr\ndf1fmahXuhWI8GmjuVpFpgW6/4EjBPMMMnVhcWkOC75HR6K+NjY4DvHUM6FMUeYg\nSdBc7+TQbTkbNPepBJ/HWQFaKsSAtgVdZnWUUyEZAoGAfLdHcsTy75i4T2arRRl9\nMoG/rerQUyHbVQb/SIDqzFwCPxpCMvIwzi9kW+ElCnTt9ANa9wEg/PfmqPwFySjx\nXpNGJY5D7G0cV3qVUpGV2KM/kxgbxzJQWPX/+8BE8WSU6cuBv+YsGIfkhrQAx+Wq\nBqvo7p/glfMVaUVvuZpzGbk=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@golang-toturial.iam.gserviceaccount.com",
    "client_id": "112904599220159293469",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40golang-toturial.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

export default function useFirebase() {
    const app = initializeApp({
        apiKey: "AIzaSyANv2UXxunG5WF5rG1-ufvihaYVfVh_cUo",
        authDomain: "golang-toturial.firebaseapp.com",
        databaseURL: "https://golang-toturial-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "golang-toturial",
        storageBucket: "golang-toturial.firebasestorage.app",
        messagingSenderId: "592894761623",
        appId: "1:592894761623:web:719e5eaca89782eddaa7d2",
        measurementId: "G-3X4L2BCGSV"
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