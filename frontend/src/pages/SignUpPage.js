import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Button, Input } from "@mui/material";

import "./styles.scss";

const SignUpPage = () => {
  return (
    <MainLayout>
      <form>
        <Input placeholder="Email" name="email" />
        <Input placeholder="Password" name="password" />
        <Input placeholder="Confirm Password" name="cpassword" />
        <Button type={"submit"} variant={"contained"}>
          Create Account
        </Button>
      </form>
    </MainLayout>
  );
};

export default SignUpPage;
