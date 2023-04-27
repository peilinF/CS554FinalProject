import React, { useContext } from "react";
import SocialSignIn from "./SocialSignIn";
import { AuthContext } from "../firebase/Auth";
import { Navigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/FirebaseFunctions";

function SignIn() {
  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  const passwordRest = (event) => {
    event.preventDefault();
    let email = document.getElementById("email");
    if (email) {
      doPasswordReset(email.value);
      alert("Password Reset Email Sent");
    } else {
      alert("Please enter your email");
    }
  };

  return (
    <div className="sign-in">
      <h1>Sign In</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit">Sign In</button>
        <button className="forgotPassword" onClick={passwordRest}>
          Forgot Password?
        </button>
      </form>

      <br />
      <SocialSignIn />
    </div>
  );
}

export default SignIn;
