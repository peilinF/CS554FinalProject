import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes,
} from "react-router-dom";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

import Home from "./Home";
import Map from "./Map/Map";

import Login from "./user/Login";
import Signup from "./user/Signup";
import Logout from "./user/Logout";

import NotFoundPage from "./NotFoundPage";
import Error from "./Error";

import axios from "axios";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
  }),
});

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = sessionStorage.getItem("authToken");

      if (token) {
        try {
          const response = await axios.get("http://localhost:4000/user-info", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setIsLoggedIn(true);
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    fetchUserInfo();
  }, [isLoggedIn]);

  const updateLoginStatus = (login_status) => {
    if (login_status) {
      console.log("user log in");
    } else {
      console.log("user log out");
    }

    setIsLoggedIn(true);
  };

  let html = (
    <ApolloProvider client={client}>
      <Router>
        <div className='App-body'>

          <div className="left">
            {isLoggedIn && userInfo && <Map userInfo={userInfo} />}
            {!isLoggedIn && <Map />}
          </div>

          <div className="right">
            <div className="right-body">
              <Routes>
                <Route path="/" element={<Home/>} />

                <Route path="/login" element={<Login updateLoginStatus={updateLoginStatus} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/logout" element={<Logout updateLoginStatus={updateLoginStatus} />} />

                <Route path="/404" element={<NotFoundPage />} />
                <Route path="/error" element={<Error />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </div>
          </div>

        </div>
      </Router>
    </ApolloProvider>
  );

  return html;
}

export default App;
