import React from "react";
import MainLayout from "../layouts/MainLayout";

import { Button, Input } from "@mui/material";

import "./styles.scss";

const SignInPage = () => {
  return (
    <MainLayout>
      <form>
        <Input placeholder="Email" name="email" />
        <Input placeholder="Password" name="password" />
        <Button variant={"contained"}>Login</Button>
      </form>
    </MainLayout>
  );
};

export default SignInPage;