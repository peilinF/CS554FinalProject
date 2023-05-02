import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
let REACT_APP_FIREBASE_KEY = "AIzaSyBanNTSX4yvX1qqLuYYpsBg4ZMTqxA_h50";
let REACT_APP_FIREBASE_DOMAIN = "cs554final-141c8.firebaseapp.com";
let REACT_APP_FIREBASE_DATABASE = "https://cs554final-141c8.firebaseio.com";
let REACT_APP_FIREBASE_PROJECT_ID = "cs554final-141c8";
let REACT_APP_FIREBASE_STORAGE_BUCKET = "cs554final-141c8.appspot.com";
let REACT_APP_FIREBASE_MESSAGING_SENDER_ID = "353020124219";
let REACT_APP_FIREBASE_APP_ID = "1:353020124219:web:509eb01d529139a383501e";
const firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_KEY,
    authDomain: REACT_APP_FIREBASE_DOMAIN,
    databaseURL: REACT_APP_FIREBASE_DATABASE,
    projectId: REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
