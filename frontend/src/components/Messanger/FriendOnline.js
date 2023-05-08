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
                                : "https://occ-0-358-37.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABZCI8XoAl54lPJXO4PqykYv3AqdO52_3chqk8wmDknaYfeo7PCFgzxG175QMEhMAMVZBJPLMDhiLS1fvEJFgTUtSJbGbF7iQZwQI.jpg?r=1dd"
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
