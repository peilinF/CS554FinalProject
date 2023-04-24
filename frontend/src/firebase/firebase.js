import * as firebase from "firebase/app";
import "firebase/auth";

const REACT_APP_FIREBASE_KEY = "AIzaSyBanNTSX4yvX1qqLuYYpsBg4ZMTqxA_h50";
const REACT_APP_FIREBASE_DOMAIN = "cs554final-141c8.firebaseapp.com";
const REACT_APP_FIREBASE_DATABASE = "https://cs554final-141c8.firebaseio.com";
const REACT_APP_FIREBASE_PROJECT_ID = "cs554final-141c8";
const REACT_APP_FIREBASE_STORAGE_BUCKET = "cs554final-141c8.appspot.com";
const REACT_APP_FIREBASE_MESSAGING_SENDER_ID = "353020124219";
const REACT_APP_FIREBASE_APP_ID = "1:353020124219:web:509eb01d529139a383501e";

const firebaseApp = firebase.initializeApp({
  apiKey: REACT_APP_FIREBASE_KEY,
  authDomain: REACT_APP_FIREBASE_DOMAIN,
  databaseURL: REACT_APP_FIREBASE_DATABASE,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
});

// const firebaseApp = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// })

export default firebaseApp;
