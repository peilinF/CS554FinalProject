import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/signup", {
        name,
        username,
        password,
        avatar: avatarUrl,
      });

      if (response.status === 200 && response.data) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  let html = (
    <div>
      <h2>Sign Up</h2>

      <form onSubmit={(event) => handleSignup(event)} className="signup-form">
        <br />

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br />

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />

        <label htmlFor="avatarUrl">Avatar URL:</label>
        <input
          type="url"
          id="avatarUrl"
          placeholder="Avatar URL"
          onChange={(e) => setAvatarUrl(e.target.value)}
        />

        <br />

        <button type="submit">Sign Up</button>
        <p>Have an account? <a href="/login">Log in</a></p>
      </form>
    </div>
  );

  return html;
};

export default Signup;
