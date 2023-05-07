import React, { useState } from "react";
import { Button, Input } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doSocialSignIn } from "../firebase/FirebaseFunctions";
import "./styles.scss";
import MainLayout from "../layouts/MainLayout";
import { Facebook, Google } from "@mui/icons-material";

const SignInPage = () => {
  const [isSocialSignInDisabled, setIsSocialSignInDisabled] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((res) => {
        if (auth.currentUser) navigate("/");
      })
      .catch((e) => alert(e));
  };

  const handleSocialSignIn = async (provider) => {
    if (isSocialSignInDisabled) return; // Prevent multiple requests

    setIsSocialSignInDisabled(true); // Disable the buttons

    try {
      await doSocialSignIn(provider, auth);
      if (auth.currentUser) navigate("/");
    } catch (error) {
      console.error("Social sign in error:", error);

      // Provide a user-friendly message for specific errors
      if (error.code === "auth/popup-closed-by-user") {
        alert("Sign in was cancelled. Please try again.");
      } else {
        alert("Social sign in error: " + error.message);
      }
    } finally {
      setIsSocialSignInDisabled(false); // Enable the buttons
    }
  };

  return (
    <MainLayout>
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <Input required placeholder="Email" name="email" />
          <Input
            required
            placeholder="Password"
            name="password"
            type="password"
          />
          <Button type="submit" variant="contained">
            Login
          </Button>
        </form>
        <div className="social-login">
          <Facebook
            fontSize={"large"}
            onClick={() => handleSocialSignIn("facebook")}
          />
          <Google
            fontSize={"large"}
            onClick={() => handleSocialSignIn("google")}
          />
          {/* <img
            src="/imgs/btn_google_signin.png"
            alt="Sign in with Google"
            style={{
              cursor: "pointer",
              display: "block",
              maxWidth: "250px",
              marginBottom: "5px",
            }}
            disabled={isSocialSignInDisabled}
          />
          <img
            src="/imgs/facebook_signin.png"
            alt="Sign in with Facebook"
            style={{ cursor: "pointer", display: "block", maxWidth: "250px" }}
            disabled={isSocialSignInDisabled}
          /> */}
        </div>
      </div>
    </MainLayout>
  );
};

export default SignInPage;
