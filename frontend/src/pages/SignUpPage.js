import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Button, Input } from "@mui/material";

import "./styles.scss";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import { apiInstance } from "../utils/apiInstance";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    const { name, email, password, cpassword } = event.target;
    // if (password !== cpassword) {
    //   // setPasswordMatch("Passwords do not match");
    //   return false;
    // }

    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async ({ user }) => {
        console.log(auth.currentUser);

        await updateProfile(auth.currentUser, { displayName: name.value });
        apiInstance
          .post("/users/register", {
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
            uid: auth.currentUser.uid,
          })
          .then((res) => navigate("/"));
      })
      .catch((e) => alert(e));
  };

  return (
    <MainLayout>
      <div className="register">
        <h2>Registration</h2>
        <form onSubmit={(e) => handleSignUp(e)}>
          <Input placeholder="Full Name" name="name" />
          <Input type="email" placeholder="Email" name="email" />
          <Input type="password" placeholder="Password" name="password" />
          <Input
            type="password"
            placeholder="Confirm Password"
            name="cpassword"
          />
          <Button type={"submit"} variant={"contained"}>
            Create Account
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default SignUpPage;
