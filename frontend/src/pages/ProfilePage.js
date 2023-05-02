import { Button, Typography } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import MainLayout from "../layouts/MainLayout";

const ProfilePage = () => {
  const auth = getAuth();
  return (
    <MainLayout>
      <div className="profile">
        <h2>Profile</h2>
        <Typography>{auth.currentUser.displayName} </Typography>
        <Typography>{auth.currentUser.email} </Typography>

        <Button onClick={() => signOut(auth)}>Logout</Button>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
