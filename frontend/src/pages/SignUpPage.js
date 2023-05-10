import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Button, Input } from "@mui/material";
import { InputLabel } from "@mui/material";

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

    console.log("name", name.value)
    console.log("email", email.value)
    console.log("password", password.value)
    console.log("cpassword", cpassword.value)
    function validateName(name) {
      const nameRegex = /^[a-zA-Z]+$/;
      if (nameRegex.test(name) === false) {
        alert("Name contains numbers or symbols")
        return false;
      }
      return true;
    }
    const validateEmail = (email) => {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (emailRegex.test(email) === false) {
        alert("Error in Email")
        return false;
      }
      return true;
    }
    const validatePassword = (password) => {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
      if (passwordRegex.test(password) === false) {
        alert("Password should contain at least 1 number, 1 symbol, and one capital letter. Also should be more than 6 characters")
        return false;
      }
      return true;
    };

    if (validateName(name.value) === false) {
      return false;
    }
    if (validateEmail(email.value) === false) {
      return false;
    }
    if (validatePassword(password.value) === false) {
      return false;
    }
    console.log(1)
    if (validatePassword(cpassword.value) === false) {
      return false;
    }
    if (password.value !== cpassword.value) {
      // setPasswordMatch("Passwords do not match");
      alert("Passwords do not match")
      return false;
    }
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
        <br />
        <form onSubmit={(e) => handleSignUp(e)}>
          <InputLabel htmlFor="name">Full Name</InputLabel>
          <Input id="name" name="name" />
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" type="email" name="email" />
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" name="password" />
          <InputLabel htmlFor="cpassword">Confirm Password</InputLabel>
          <Input id="cpassword" type="password" name="cpassword" />
          <Button type={"submit"} variant={"contained"}>
            Create Account
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default SignUpPage;
