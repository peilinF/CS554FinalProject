import "../App.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { doPasswordReset } from "../../firebase/FirebaseFunctions";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {

    const auth = getAuth();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        const { email, password } = event.target;

        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((res) => {
                if (auth.currentUser) navigate("/");
            })
            .catch((e) => {
                alert(e);
                setErrorMessage(e.message);
            });
    };

    const passwordRest = (event) => {
        event.preventDefault();
        let email = document.getElementById("email");
        if (email) {
            doPasswordReset(email.value);
            alert("Password Reset Email Sent");
        } else {
            alert("Please enter your email");
        }
    };

    let html = (
        <div>
            <h2>Login</h2>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <form onSubmit={(event) => handleLogin(event)} className="login-form">
                <br />

                <label htmlFor="Email">Email:</label>
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
                    placeholder="password"
                    required
                />

                <br />

                <button type="submit" className="login-btn">Login</button>
                <p>New to this website? <a href="/register">Sign Up</a></p>

            </form>
        </div>
    );

    return html;
};

export default Login;
