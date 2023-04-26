import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";

const Login = (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/login", {
        username,
        password,
      });

      if (response.status === 200 && response.data) {
        // Save the authentication token in sessionStorage or localStorage
        
        sessionStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userId", response.data.userInfo._id);
        
        // Update the loginStatus in App.js
        props.updateLoginStatus(true);
        
        // Navigate to the home page
        navigate("/");
      } else {
        setErrorMessage("Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error);
    }
  };

  let html = (
    <div>
      <h2>Login</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form onSubmit={(event) => handleLogin(event)} className="login-form">
        <br />

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="Username"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />

        <button type="submit">Login</button>
        <p>New to this website? <a href="/signup">Sign Up</a></p>

      </form>
    </div>
  );

  return html;
};

export default Login;
