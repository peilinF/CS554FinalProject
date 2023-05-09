import "./FriendList.css"
import React, { useEffect, useState } from "react";

const Conversation = ({ conversation, userID }) => {
  const [user, setUser] = useState(null)
  // find friend by ID
  useEffect(() => {
    const fetchData = async () => {
      const friendId = conversation.find(i => i !== userID);
      const response = await fetch(`/users/${friendId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setUser(data);
    };
    fetchData();
  }, []);
  return (
    <div className="conversation">
      <img className="conversationImg"
        src={
          user?.picture
            ? user.picture
            : "https://t4.ftcdn.net/jpg/00/97/00/09/360_F_97000908_wwH2goIihwrMoeV9QF3BW6HtpsVFaNVM.jpg"
        }
        alt="Unknown" />
      <div className="conversationName">{user?.name}</div>
    </div>
  )
};

export default Conversation;
