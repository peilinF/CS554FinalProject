import "./Message.css"

const Message = ({ own }) => {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img className="conversationImg"
                    src="https://occ-0-358-37.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABZCI8XoAl54lPJXO4PqykYv3AqdO52_3chqk8wmDknaYfeo7PCFgzxG175QMEhMAMVZBJPLMDhiLS1fvEJFgTUtSJbGbF7iQZwQI.jpg?r=1dd"
                    alt="Unknown" />
                <p className="messageText">Hello there Hello there Hello there Hello there Hello there Hello there</p>
            </div>
            <div className="messageBot">1:30 pm</div>
        </div>
    )
};

export default Message;
