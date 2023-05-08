import "./FriendList.css"
import React, { useEffect, useState } from "react";

const Conversation = ({ conversation, userID }) => {
  const [user, setUser] = useState(null)
  // find friend by ID
  useEffect(() => async () => {
    const frinedId = conversation.find(i => i !== userID);
    await fetch(`/users/${frinedId}`, {
      method: 'Get',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        setUser(data)
      });
  }, [])
  console.log("user1", user)
  return (
    <div className="conversation">
      <img className="conversationImg"
        src={
          user?.picture
            ? user.picture
            : "https://occ-0-358-37.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABZCI8XoAl54lPJXO4PqykYv3AqdO52_3chqk8wmDknaYfeo7PCFgzxG175QMEhMAMVZBJPLMDhiLS1fvEJFgTUtSJbGbF7iQZwQI.jpg?r=1dd"
        }
        alt="Unknown" />
      <div className="conversationName">{user?.name}</div>
    </div>
  )
};

export default Conversation;
