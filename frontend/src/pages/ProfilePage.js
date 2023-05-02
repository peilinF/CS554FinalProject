import { Button, Typography } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import React from "react";

const ProfilePage = () => {
  const auth = getAuth();
  return (
    <div>
      <Typography>{auth.currentUser.displayName} </Typography>
      <Typography>{auth.currentUser.email} </Typography>

      <Button onClick={() => signOut(auth)}>Logout</Button>
    </div>
  );
};

export default ProfilePage;
