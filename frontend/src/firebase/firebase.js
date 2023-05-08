import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

let REACT_APP_FIREBASE_KEY = "AIzaSyBanNTSX4yvX1qqLuYYpsBg4ZMTqxA_h50"
let REACT_APP_FIREBASE_DOMAIN = "cs554final-141c8.firebaseapp.com"
let REACT_APP_FIREBASE_DATABASE = "https://cs554final-141c8.firebaseio.com"
let REACT_APP_FIREBASE_PROJECT_ID = "cs554final-141c8"
let REACT_APP_FIREBASE_STORAGE_BUCKET = "cs554final-141c8.appspot.com"
let REACT_APP_FIREBASE_MESSAGING_SENDER_ID = "353020124219"
let REACT_APP_FIREBASE_APP_ID = "1:353020124219:web:509eb01d529139a383501e"

const app = initializeApp({
  apiKey: REACT_APP_FIREBASE_KEY,
  authDomain: REACT_APP_FIREBASE_DOMAIN,
  databaseURL: REACT_APP_FIREBASE_DATABASE,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
});

// const app = initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// });

export const auth = getAuth(app);

export default app;
