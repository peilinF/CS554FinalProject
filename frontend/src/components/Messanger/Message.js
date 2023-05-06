//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
//about time
import "./Message.css"
import React, { useEffect, useState } from "react";
const Message = ({ Text, Time, own }) => {
    const [timeAgo, setTimeAgo] = useState("");
    //update time on messages
    useEffect(() => {
        const updateTimeAgo = () => {
            const timeSent = new Date(Time);
            const now = new Date();
            const timeDifference = now.getTime() - timeSent.getTime();
            if (timeDifference < 60000) { // less than a minute ago
                setTimeAgo("just now");
            } else if (timeDifference < 3600000) { // less than an hour ago
                const minutesAgo = Math.floor(timeDifference / 60000);
                setTimeAgo(`${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`);
            } else if (timeDifference < 86400000) { // less than a day ago
                const hoursAgo = Math.floor(timeDifference / 3600000);
                setTimeAgo(`${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`);
            } else if (timeDifference < 604800000) { // less than a week ago
                const daysAgo = Math.floor(timeDifference / 86400000);
                setTimeAgo(`${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`);
            } else { // less than a month ago
                const weeksAgo = Math.floor(timeDifference / 604800000);
                setTimeAgo(`${weeksAgo} week${weeksAgo !== 1 ? "s" : ""} ago`);
            }
        };
        updateTimeAgo();
        const interval = setInterval(updateTimeAgo, 60000);
        return () => clearInterval(interval);
    }, [Time]);
    return (
        <div className="message">
            {
                own ? (

                    <>
                        <div className="ownText">{Text}</div>
                        <div className="timeAgo">{timeAgo}</div>
                    </>
                ) : (
                    <>
                        <div className="frinedText">{Text}</div>
                        <div className="timeAgo">{timeAgo}</div>
                    </>
                )
            }
        </div>
    )
};

export default Message;

{/* <div className={own ? "message own" : "message"}>
<div className="messageTop">
    <img className="conversationImg"
        src="https://occ-0-358-37.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABZCI8XoAl54lPJXO4PqykYv3AqdO52_3chqk8wmDknaYfeo7PCFgzxG175QMEhMAMVZBJPLMDhiLS1fvEJFgTUtSJbGbF7iQZwQI.jpg?r=1dd"
        alt="Unknown" />
    <div className="messageText">{Text}</div>
</div>
<div className="messageBot">{timeAgo}</div>
</div> */}