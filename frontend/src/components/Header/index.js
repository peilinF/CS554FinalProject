import { getAuth } from "firebase/auth";
import React from "react";
import { NavLink } from "react-router-dom";

import "./styles.scss";

const Header = () => {
  const { currentUser } = getAuth();

  return (
    <header>
      <h1>RunMate</h1>

      {currentUser ? (
        <NavLink to={"/profile"}>Profile</NavLink>
      ) : (
        <NavLink to={"/login"}>Login</NavLink>
      )}
    </header>
  );
};

export default Header;
