import React from "react";
import { Button, Input } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doSocialSignIn } from "../firebase/FirebaseFunctions";
import "./styles.scss";

const SignInPage = () => {
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
    try {
      await doSocialSignIn(provider, auth);
      if (auth.currentUser) navigate("/");
    } catch (error) {
      console.error("Social sign in error:", error);
      alert("Social sign in error: " + error.message);
    }
  };  

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <Input required placeholder="Email" name="email" />
        <Input required placeholder="Password" name="password" type="password" />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </form>
      <div className="social-login">
        <img
          src="/imgs/btn_google_signin.png"
          alt="Sign in with Google"
          onClick={() => handleSocialSignIn("google")}
          style={{ cursor: "pointer", display: "block", maxWidth: "250px", marginBottom: "5px" }}
        />
        <img
          src="/imgs/facebook_signin.png"
          alt="Sign in with Facebook"
          onClick={() => handleSocialSignIn("facebook")}
          style={{ cursor: "pointer", display: "block", maxWidth: "250px" }}
        />
      </div>
    </div>
  );
};

export default SignInPage;


