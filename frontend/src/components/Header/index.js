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

      <div className="auth-links">
        {currentUser ? (
          window.location.pathname !== "/profile" ? (
            <NavLink className="nav-link" to="/profile">
              Profile
            </NavLink>
          ) : (
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          )
        ) : (
          <>
            <NavLink className="nav-link" to="/register">
              Sign up
            </NavLink>
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
