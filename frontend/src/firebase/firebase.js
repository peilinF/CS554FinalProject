import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

let REACT_APP_FIREBASE_KEY = "AIzaSyDJric3VSK2HIG3BtXz8THUdglxRHipIPU";
let REACT_APP_FIREBASE_DOMAIN = "runn-mate.firebaseapp.com";
let REACT_APP_FIREBASE_DATABASE = "https://cs554final-141c8.firebaseio.com";
let REACT_APP_FIREBASE_PROJECT_ID = "runn-mate";
let REACT_APP_FIREBASE_STORAGE_BUCKET = "runn-mate.appspot.com";
let REACT_APP_FIREBASE_MESSAGING_SENDER_ID = "944915244191";
let REACT_APP_FIREBASE_APP_ID = "1:944915244191:web:9854a08337bc7ad387aeaa";

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
