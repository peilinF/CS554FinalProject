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
      {/* {currentUser ? (
        <div className="htxt" onClick={() => navigate("/")}>
          <Typography fontSize={"2em"} variant={"h1"} fontStyle={"italic"}>
            RunMate
          </Typography>
        </div>
      ) : (
        <div className="htxt" >
          <Typography fontSize={"2em"} variant={"h1"} fontStyle={"italic"}>
            RunMate
          </Typography>
        </div>
      )} */}

      <div className="htxt" onClick={() => navigate("/")}>
        <Typography fontSize={"2em"} variant={"h1"} fontStyle={"italic"}>
          RunMate
        </Typography>
      </div>

      <div className="auth-links">
        {currentUser ? (
          <>
            <NavLink className="nav-link" to="/chat">
              Chat
            </NavLink>
            <NavLink className="nav-link" to="/mymap">
              Map
            </NavLink>
            <NavLink className="nav-link" to="/friends">
              Friends
            </NavLink>

            <NavLink className="nav-link" to="/profile">
              Profile
            </NavLink>
          </>
        ) : (
          <>
            {window.location.pathname !== "/login" && (
              <NavLink to={"/login"}>Login</NavLink>
            )}

            {window.location.pathname !== "/register" && (
              <NavLink to={"/register"}>SignUp</NavLink>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
