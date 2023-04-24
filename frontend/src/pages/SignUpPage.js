import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Button, Input } from "@mui/material";

import "./styles.scss";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase";

const SignUpPage = () => {
  const handleSignUp = async (event) => {
    event.preventDefault();
    const { email, password, cpassword } = event.target;
    // if (password !== cpassword) {
    //   // setPasswordMatch("Passwords do not match");
    //   return false;
    // }

    await createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((res) => {
        console.log(res);
        updateProfile({ displayName: email });
      })
      .catch((e) => alert(e));
  };

  return (
    <MainLayout>
      <div className="register">
        <form onSubmit={(e) => handleSignUp(e)}>
          <Input placeholder="Email" name="email" />
          <Input placeholder="Password" name="password" />
          <Input placeholder="Confirm Password" name="cpassword" />
          <Button type={"submit"} variant={"contained"}>
            Create Account
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default SignUpPage;
