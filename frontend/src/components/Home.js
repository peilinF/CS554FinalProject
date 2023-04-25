import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axios.get("http://localhost:4000/user-info", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200 && response.data) {
            setIsLoggedIn(true);
            setUserInfo(response.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchUserData();
  }, []);

  let content;
  if (isLoggedIn && userInfo) {
    content = (
      <div>
        <h2>Welcome, {userInfo.username}!</h2>
        <p>You are now logged in.</p>
        <p>Log out here. <a href="/logout">Log out</a></p>
      </div>
    );
  } else {
    content = (
      <div>
        <h2>Welcome to our website!</h2>
        <p>Please <a href="/login">log in</a> or <a href="/signup">sign up</a> to access more features.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Home</h1>
      {content}
    </div>
  );
};

export default Home;
