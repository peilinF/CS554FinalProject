import React from "react";
import "./ChatPage.css";
import FriendProfile from "../components/Messanger/FriendProfile"
import Message from "../components/Messanger/Message"
import FriendOnline from '../components/Messanger/FriendOnline'

const ChatPage = () => {
    return (
        <div className="row">
            <div className="column left">
                <h2>chatMenu</h2>
                <input placeholder="Friend Search" className="FriendSearch"></input>
                <FriendProfile />
                <FriendProfile />
                <FriendProfile />
            </div>
            <div className="column middle">
                <div className="chatBoxMessages">
                    <h2>chatBox</h2>
                    <Message />
                    <Message own={true} />
                    <Message />
                    <Message />
                    <Message own={true} />
                    <Message />
                    <Message />
                    <Message own={true} />
                    <Message />
                    <Message />
                    <Message own={true} />
                    <Message />
                </div>
                <div className="chatBoxSend">
                    <input placeholder="Send message" className="ChatMessageButton"></input>
                    <button className="messageSubmite">Send</button>
                </div>
            </div>
            <div className="column right">
                <h2>chatOnline</h2>
                <FriendOnline />
            </div>
        </div>
    );
};

export default ChatPage;
