import "./FriendOnline.css"
import React, { useEffect, useState } from "react";

const FriendInfo = ({ conversation, friendId }) => {
    const [user, setUser] = useState(null)
    // find friend by ID
    useEffect(() => {
        const fetchUserData = async () => {
            const friendId1 = conversation.find((i) => i !== friendId);
            const response = await fetch(`/users/${friendId1}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setUser(data);
        };

        fetchUserData();
    }, []);

    return (
        <div className=".FriendBio">
            <ul className="no-bullets">
                <li>
                    <img className="FriendImg"
                        src={
                            user?.picture
                                ? user.picture
                                : "https://t4.ftcdn.net/jpg/00/97/00/09/360_F_97000908_wwH2goIihwrMoeV9QF3BW6HtpsVFaNVM.jpg"
                        }
                        alt="Unknown" />
                </li>
                <li className="conversationName">{user?.name}</li>
                <li className="conversationEmail">{user?.email}</li>
            </ul>
        </div >

    )
};

export default FriendInfo;
