// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBKF_-Lj9BeBzJ1SyMRq0b5qfgdZB3je9o",
    authDomain: "ash-382503.firebaseapp.com",
    projectId: "ash-382503",
    storageBucket: "ash-382503.appspot.com",
    messagingSenderId: "722266122298",
    appId: "1:722266122298:web:f4af510bf92ffc36b22d03",
    measurementId: "G-7TF0W096G3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;