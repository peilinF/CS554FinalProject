import "./FriendList.css"
import React, { useEffect, useState } from "react";

const Conversation = ({ userID, conversationId }) => {
  const [user, setUser] = useState(null)
  console.log(userID)
  console.log(conversationId)

  return (
    <div className="conversation">
      <img className="conversationImg"
        src="https://occ-0-358-37.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABZCI8XoAl54lPJXO4PqykYv3AqdO52_3chqk8wmDknaYfeo7PCFgzxG175QMEhMAMVZBJPLMDhiLS1fvEJFgTUtSJbGbF7iQZwQI.jpg?r=1dd"
        alt="Unknown" />
      <p className="conversationName">John Wick</p>
    </div>

  )
};

export default Conversation;
