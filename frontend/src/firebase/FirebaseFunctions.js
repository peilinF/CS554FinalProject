import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  updatePassword,
} from "firebase/auth";

async function doSocialSignIn(provider, auth) {
  let socialProvider = null;
  if (provider === "google") {
    socialProvider = new GoogleAuthProvider();
  } else if (provider === "facebook") {
    socialProvider = new FacebookAuthProvider();
  }
  await signInWithPopup(auth, socialProvider);
}


async function doPasswordReset(email) {
  await sendPasswordResetEmail(email);
}

async function doPasswordUpdate(password) {
  await updatePassword(password);
}

async function doSignOut() {
  await signOut();
}

async function doChangePassword(email, oldPassword, newPassword) {
  let credential = EmailAuthProvider.credential(email, oldPassword);
  await reauthenticateWithCredential(credential);
  await updatePassword(newPassword);
  await doSignOut();
}

export {
  doSocialSignIn,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  doChangePassword,
};
