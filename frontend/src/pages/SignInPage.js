import React from "react";
import MainLayout from "../layouts/MainLayout";

import { Button, Input } from "@mui/material";

import "./styles.scss";
import { doPasswordReset } from "../firebase/FirebaseFunctions";
import { Navigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

const SignInPage = () => {
  const currentUser = getAuth().currentUser;

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = event.target;

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((res) => {
        console.log(res);
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

  if (currentUser) {
    return <Navigate to="/home" />;
  }
  return (
    <MainLayout>
      <div className="login">
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
