import React from "react";
import MainLayout from "../layouts/MainLayout";
import "./styles.scss";
import { Button, Input } from "@mui/material";
import { doPasswordReset } from "../firebase/FirebaseFunctions";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const SignInPage = () => {
  const auth = getAuth();
  const naviagate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = event.target;

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((res) => {
        if (auth.currentUser) naviagate("/");
      })
      .catch((e) => alert(e));
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
    <MainLayout>
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={(e) => handleLogin(e)}>
          <Input required placeholder="Email" name="email" id="email" />
          <Input
            required
            placeholder="Password"
            name="password"
            id="password"
          />
          <Button type={"submit"} variant={"contained"}>
            Login
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default SignInPage;
