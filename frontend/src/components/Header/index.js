import { getAuth } from "firebase/auth";
import React from "react";
import { NavLink } from "react-router-dom";

import "./styles.scss";
import { Typography } from "@mui/material";

const Header = () => {
  const { currentUser } = getAuth();

  return (
    <header>
      <Typography variant={"h1"} fontStyle={"italic"}>
        RunMate
      </Typography>

      {currentUser ? (
        window.location.pathname != "/profile" ? (
          <NavLink to={"/profile"}>Profile</NavLink>
        ) : (
          <NavLink to={"/"}>Home</NavLink>
        )
      ) : (
        <NavLink to={"/login"}>Login</NavLink>
      )}
    </header>
  );
};

export default Header;
