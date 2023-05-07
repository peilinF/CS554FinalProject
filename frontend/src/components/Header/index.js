import { getAuth } from "firebase/auth";
import React from "react";
import { NavLink } from "react-router-dom";

import "./styles.scss";
import { Typography } from "@mui/material";

const Header = () => {
  const { currentUser } = getAuth();

  return (
    <header className="header">
      <Typography variant={"h1"} fontStyle={"italic"}>
        RunMate
      </Typography>
      <nav>
        {currentUser ? (
          <>
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/mymap"}>Map</NavLink>
            <NavLink to={"/chat"}>Chat</NavLink>
            <NavLink to={"/profile"}>Profile</NavLink>
          </>
        ) : (
          <>
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/mymap"}>Map</NavLink>
            <NavLink to={"/login"}>Login</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;