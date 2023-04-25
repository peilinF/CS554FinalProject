import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import FriendList from "../components/Messanger/FriendList"
import Message from "../components/Messanger/Message"
import FriendOnline from '../components/Messanger/FriendOnline'

const ChatPage = () => {
    const [conversations, setConversations] = useState([])
    const [chat, setChat] = useState(null)
    const [messagesList, setMessagesList] = useState([])
    const user = { "id": "6446fc4cd7172792920794e0", "name": "Bob1", "username": "Bob1" }

    useEffect(() => async () => {
        await fetch(`/conversations/${user.id}`, {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                setConversations(data)
            }).catch(e => console.log(e));
    }, [user.id]);
    console.log(chat?._id)
    useEffect(() => async () => {
        await fetch(`/messages/${conversations?.id}`, {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                setMessagesList(data)
            }).catch(e => console.log(e));
    }, [])
    let frinedList = conversations.map(i => (
        < li key={i._id} onClick={() => setChat(i)}>
            <FriendList conversation={i.members} userID={user.id} />
        </li >
    ));
    if (conversations !== null) {
        let messageBox = messagesList.map(i => (
            <li>
                <Message ConversationId={i.ConversationId}
                    UserdId={i.UserdId}
                    Text={i.Text}
                    Time={i.Time}
                    own={i.UserdId === user.id} />
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
                    {chat ? (
                        <div className="chatBox">
                            <div className="chatBoxMessages">
                                <h2>chatBox</h2>
                                <ul>
                                    {messageBox}
                                </ul>
                                <Message />
                            </div>
                            <div className="chatBoxSend">
                                <input placeholder="Send message" className="ChatMessageButton"></input>
                                <button className="messageSubmite">Send</button>
                            </div>
                        </div>
                    ) : (
                        <div className="chatNotOpen">No Chat Opened</div>
                    )}
                </div>
                <div className="column right">
                    <h2>FriendOnline</h2>
                    <FriendOnline />
                </div>
            </div>
        );
    };

    export default ChatPage;
