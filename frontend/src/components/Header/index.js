import { getAuth } from "firebase/auth";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./styles.scss";
import { Typography } from "@mui/material";

const Header = () => {
  const { currentUser } = getAuth();
  const navigate = useNavigate();

  return (
    <header>
      <div className="htxt" onClick={() => navigate("/")}>
        <Typography variant={"h1"} fontStyle={"italic"}>
          RunMate
        </Typography>
      </div>

      {currentUser ? (
        window.location.pathname != "/profile" ? (
          <NavLink to={"/profile"}>Profile</NavLink>
        ) : (
          <NavLink to={"/"}>Home</NavLink>
        )
      ) : window.location.pathname == "/register" ? (
        <NavLink to={"/login"}>Login</NavLink>
      ) : (
        <NavLink to={"/register"}>Sign up</NavLink>
      )}
    </header>
  );
};

export default Header;
