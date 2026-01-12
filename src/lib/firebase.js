import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp({
    apiKey: "AIzaSyBl9JFXJ3n8Y-jKFJqnO98F6jubass0lGk",
    authDomain: "golang-tutorial-2.firebaseapp.com",
    projectId: "golang-tutorial-2",
    storageBucket: "golang-tutorial-2.firebasestorage.app",
    messagingSenderId: "249706562020",
    appId: "1:249706562020:web:88ead84f121ce76aac87f1",
    measurementId: "G-NJ857P05GV"
});

export const auth = getAuth(app);
export default app;
