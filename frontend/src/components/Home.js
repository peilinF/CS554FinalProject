import './App.css'

import React, { useState, useEffect } from "react";
import axios from "axios";

import UserProfile from "./user/UserProfile";
import Runner from "./Runner/Runner";

import { useMutation } from "@apollo/client";
import queries from "../graphql/queries";

import { getAuth, signOut } from "firebase/auth";

import { apiInstance } from '../utils/apiInstance';

const Home = (props) => {

    const auth = getAuth();
    const [updateUserPosition] = useMutation(queries.UPDATE_USER_POSITION);

    const [userInfo, setUserInfo] = useState(null);

    const getUserInfo = async (auth) => {
        if (auth.currentUser) {
            await auth.currentUser.getIdToken(true)
                .then(async (idToken) => {
                    await apiInstance
                        .get("/users/user-info", {
                            headers: {
                                Authorization: `Bearer ${idToken}`,
                            },
                        })
                        .then((response) => {
                            updateLocation(response.data);
                            // setUserInfo(response.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const [userId, setUserId] = useState(() => {
        if (auth && auth.currentUser) {
            getUserInfo(auth);
            return auth.currentUser.uid;
        } else {
            return null;
        } 
    });

    if (auth.currentUser) {
        if (auth.currentUser.uid !== userId) {
            console.log("user id changed in Home page");
            setUserId(auth.currentUser.uid);
        }
    }

    const updateLocation = (userInfo) => {

        // get current location

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const random_pos = {
                    lat: latitude + (Math.random() - 0.1) * 2,
                    lng: longitude + (Math.random() - 0.1) * 2,
                };

                const pos = {
                    lat: latitude,
                    lng: longitude,
                };

                let used_pos = random_pos;

                // update user position in database

                if (userInfo.lastPosition.lat !== used_pos.lat || userInfo.lastPosition.lng !== used_pos.lng) {
                    try {
                        await updateUserPosition({ variables: { userId: userInfo._id, position: used_pos } });
                    } catch (error) {
                        console.log("failed to update user position in database");
                    }

                    userInfo.lastPosition = used_pos;
                }

                // update user position in session storage

                setUserInfo(userInfo);
                props.updateUserInfo(userInfo);
            }, (error) => {
                console.log(error);
            });


        } else {
            console.log("Geolocation is not supported by this browser.");
        }

    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth && auth.currentUser) {
                if (auth.currentUser.uid !== userId) {
                    console.log("user id changed in Home page");
                    setUserId(auth.currentUser.uid);
                }
                try {
                    await getUserInfo(auth);
                    // console.log("Home page, ", userInfo);
                } catch (error) {
                    console.log("failed to get user info");
                    console.log(error);
                }
            }
        };

        fetchUserData();
    }, [userId]);

    // render page

    if (props.runner_page && userInfo) {
        return (
            <div>
                <Runner userInfo={userInfo} />
            </div>
        );
    }

    // console.log("Home page, ", userInfo);
    let content = undefined;
    if (auth && userInfo) {
        content = (
            <div>
                <h2>Welcome, {userInfo.name}!</h2>
                <p>You are now logged in. <a href="/" onClick={() => signOut(auth)}>Sign Out</a></p>
                
                <br />

                <UserProfile userInfo={userInfo} />
            </div>
        );
    } else {
        content = (
            <div>
                <h2>Welcome to our website!</h2>
                <p>Please <a href="/login">log in</a> or <a href="/register">sign up</a> to access more features.</p>
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
