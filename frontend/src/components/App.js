import React, { useState } from "react";
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

  const updateLoginStatus = (user) => {
    setIsLoggedIn(true);
    setUserInfo(user);
  };

  let html = (
    <ApolloProvider client={client}>
      <Router>
        <div className='App-body'>

          <div className="left">
            {isLoggedIn && userInfo && <Map userAvatar={userInfo.avatar} />}
            {!isLoggedIn && <Map />}
          </div>

          <div className="right">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login updateLoginStatus={updateLoginStatus}/>} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/logout" element={<Logout />} />

              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/error" element={<Error />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </div>

        </div>
      </Router>
    </ApolloProvider>
  );

  return html;
}

export default App;
