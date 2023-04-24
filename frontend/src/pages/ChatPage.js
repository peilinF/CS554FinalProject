import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import FriendList from "../components/Messanger/FriendList"
import Message from "../components/Messanger/Message"
import FriendOnline from '../components/Messanger/FriendOnline'

const ChatPage = () => {
    const [conversationsId, setConversationsId] = useState([])
    const user = { "id": "6446b25393f876318ad22d9b", "name": "Bob1", "username": "Bob1" }

    useEffect(() => async () => {
        await fetch(`/conversations/${user.id}`, {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                setConversationsId(data)
            });
    }, [user.id]);
    let frinedList = conversationsId.map(i => (
        <li>
            <FriendList conversationId={i} userID={user.id} />
        </li>
    ))
    return (
        <div className="row">
            <div className="column left">
                <h2>chatMenu</h2>
                <input placeholder="Friend Search" className="FriendSearch"></input>
                <ul>
                    {frinedList}
                </ul>
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
