import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await axios.get("http://localhost:4000/logout");

                if (response.status === 200 && response.data) {
                    sessionStorage.removeItem("authToken");
                    localStorage.removeItem("userId");
                    props.updateLoginStatus(false);
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
            }
        };
        logout();
    }, []);

    return <div>Logging out...</div>;
};

export default Logout;
