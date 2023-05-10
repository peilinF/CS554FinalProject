import { Button, TextField, Typography } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";

import { AccountCircle } from "@mui/icons-material";

const ProfilePage = () => {
  const auth = getAuth();
  const [name, setName] = useState(
    auth.currentUser.displayName ? auth.currentUser.displayName : ""
  );
  const [email, setEmail] = useState(
    auth.currentUser.email ? auth.currentUser.email : ""
  );

  const editProfile = () => {};
  return (
    <MainLayout>
      <div className="profile">
        <h2>Profile</h2>
        <div className="pimage">
          {auth.currentUser.photoURL ? (
            <img
              className="conversationImg"
              src="https://t4.ftcdn.net/jpg/00/97/00/09/360_F_97000908_wwH2goIihwrMoeV9QF3BW6HtpsVFaNVM.jpg"
              alt="Unknown"
            />
          ) : (
            <AccountCircle id="a_icon" />
          )}
        </div>

        <TextField
          className="custom-textfield"
          onChange={(e) => setName(e.target.value)}
          style={{ margin: "10px", width: "70%" }}
          value={name}
          label="Name"
          disabled={true}
          inputProps={{
            style: { color: "red" },
          }}
        />
        <TextField
          className="custom-textfield"
          style={{ margin: "10px", width: "70%" }}
          value={email}
          label="Email"
          disabled={true}
        />
        <Button onClick={() => signOut(auth)}>Logout</Button>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
