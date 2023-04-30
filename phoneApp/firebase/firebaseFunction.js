// firebaseFunctions.js
import { getAuth, signInWithPopup, sendPasswordResetEmail, updatePassword, signOut, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import app from "./firebaseConfig";

const auth = getAuth(app);

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === "google") {
    socialProvider = new GoogleAuthProvider();
  } else if (provider === "facebook") {
    socialProvider = new FacebookAuthProvider();
  }
  await signInWithPopup(auth, socialProvider);
}

async function doPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

async function doPasswordUpdate(password) {
  const user = auth.currentUser;
  if (user) {
    await updatePassword(user, password);
  }
}

async function doSignOut() {
  await signOut(auth);
}

async function doChangePassword(email, oldPassword, newPassword) {
  const user = auth.currentUser;
  if (user) {
    let credential = EmailAuthProvider.credential(email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    await doSignOut();
  }
}

export {
  doSocialSignIn,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  doChangePassword,
};
