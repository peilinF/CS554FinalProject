import "../App.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword, updateProfile, } from "firebase/auth";
import { auth } from "../../firebase/firebase";

import { apiInstance } from "../../utils/apiInstance";

const Signup = () => {
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        const { name, email, password, avatarUrl } = event.target;

        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then(async ({ user }) => {
                console.log(auth.currentUser);

                await updateProfile(auth.currentUser, { displayName: name.value });
                apiInstance
                    .post("/users/register", {
                        name: auth.currentUser.displayName,
                        email: auth.currentUser.email,
                        uid: auth.currentUser.uid,
                        avatarUrl: avatarUrl.value,
                    })
                    .then((res) => navigate("/"));
            })
            .catch((e) => alert(e));
    };

    let html = (
        <div>
            <br />
            <h2>Sign Up</h2>

            <form onSubmit={(event) => handleSignup(event)} className="signup-form">
                <br />

                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    required
                />

                <br />

                <label htmlFor="username">Email:</label>
                <input
                    type="text"
                    id="email"
                    placeholder="Email"
                    required
                />

                <br />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    required
                />

                <br />

                <label htmlFor="avatarUrl">Avatar URL:</label>
                <input
                    type="url"
                    id="avatarUrl"
                    placeholder="Avatar URL"
                    required
                />

                <br />

                <button type="submit" className="signup-btn">Sign Up</button>
                <br />
                <p>Have an account? <a href="/login">Log in</a></p>
            </form>
        </div>
    );

    return html;
};

export default Signup;
