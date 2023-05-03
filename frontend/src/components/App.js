import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Navigate, NavLink, Route, Routes } from "react-router-dom";

import Map from "./Map/Map";
import Home from "./Home";
import ChatPage from "./Chat/ChatPage";

import NotFoundPage from "./NotFoundPage";
import Error from "./Error";

import Login from "./user/Login";
import Signup from "./user/Signup";
import ChangePassword from "./user/ChangePassword";

import { onAuthStateChanged, getAuth } from "firebase/auth";

import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from "@apollo/client";

import { url as server_url, apiInstance } from "../utils/apiInstance";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: server_url + "graphql",
    }),
});

function App() {

    const auth = getAuth();

    const [userInfo, setUserInfo] = useState(null);
    const [logInfo, setLogInfo] = useState(null);

    const updateUserInfo = (userInfo) => {
        // console.log("update user info in App.js");
        setUserInfo(userInfo);
    };

    const handleMapLogInfo = useCallback((logInfo) => {
        console.log("handleMapLogInfo in App.js");
        setLogInfo(logInfo);
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUser(user);
                setLoading(false);
            } else {
                setLoading(false);
                setUser(null);
            }
        });

        // Clean up the listener when the component is unmounted
        return () => {
            unsubscribe();
        };
    }, []);

    // console.log("App page, ", userInfo);
    if (loading) {
        return <div className="loader"><p>Loading...</p></div>;
    } else {
        let html = (
            <ApolloProvider client={client}>
                <Router>
                    <div className="App-body">

                        <div className="left">
                            <Map userInfo={userInfo} logInfo={logInfo} />
                        </div>

                        <div className="right">
                            <div className="right-body">
                                <Routes>
                                    <Route path="/" element={<Home updateUserInfo={updateUserInfo} userInfo={userInfo} />} />

                                    <Route path="/runner" element={user ? (
                                        <Home updateUserInfo={updateUserInfo} userInfo={userInfo} runner_page={true} handleMapLogInfo={handleMapLogInfo} />
                                    ) : (
                                        <Navigate to={"/"} />
                                    )} />

                                    <Route path='/login' element={user ? (<Navigate to={"/"} />) : (<Login />)} />
                                    <Route path='/register' element={user ? (<Navigate to={"/"} />) : (<Signup />)} />
                                    <Route path='/changePassword' element={user ? (<ChangePassword />) : (<Navigate to={"/"} />)} />

                                    {/* <Route path='chat' element={user ? (<ChatPage />) : (<Navigate to={"/"} />)} /> */}

                                    <Route path="/404" element={<NotFoundPage />} />
                                    <Route path="/error" element={<Error />} />
                                    <Route path="*" element={<Error />} />
                                </Routes>

                                <div className="footer">
                                    <div className="footer-body">

                                        <NavLink to="/" onClick={(event) => { handleMapLogInfo(null) }}>
                                            <button>Home</button>
                                        </NavLink>

                                        <NavLink to="/runner">
                                            <button>Runner</button>
                                        </NavLink>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </Router>
            </ApolloProvider>
        );

        return html;
    }


}

export default App;
