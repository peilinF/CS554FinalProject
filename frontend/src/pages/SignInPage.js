import React from "react";
import MainLayout from "../layouts/MainLayout";

import { Button, Input } from "@mui/material";

import "./styles.scss";

const SignInPage = () => {
  return (
    <MainLayout>
      <div className="login">
        <form>
          <Input placeholder="Email" name="email" id='email'/>
          <Input placeholder="Password" name="password" id='password'/>
          <Button variant={"contained"}>Login</Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default SignInPage;
