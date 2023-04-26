import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import FriendList from "../components/Messanger/FriendList"
import Message from "../components/Messanger/Message"
import FriendOnline from '../components/Messanger/FriendOnline'

const ChatPage = () => {
    const [conversations, setConversations] = useState([])
    const [chat, setChat] = useState({ _id: null })
    const [messagesList, setMessagesList] = useState([])
    const [sendMessage, setSendMessage] = useState([])
    const user = { "id": "6446fc4cd7172792920794e0", "name": "Bob1", "username": "Bob1" }

    useEffect(() => {
        const conversationsData = async () => {
            await fetch(`/conversations/${user.id}`, {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
                .then(data => {
                    setConversations(data)
                }).catch(e => console.log(e));
        }
        conversationsData()
    }, [user.id]);

    useEffect(() => {
        const conversationsData = async () => {
            if (chat._id !== null) {
                await fetch(`/messages/${chat._id}`, {
                    method: 'Get',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())
                    .then(data => {
                        setMessagesList(data)
                    }).catch(e => console.log(e));
            }
        }
        conversationsData()
    }, [chat]);

    const handleMessageSubmite = async (event) => {
        event.preventDefault();
        //create message
        //conversationId, userdId, text
        const newMessage = document.getElementById('newMessage').value;
        console.log(newMessage)
        await fetch(`/messages`, {
            method: 'Post',
            body: JSON.stringify({
                conversationId: chat._id,
                userdId: user.id,
                text: newMessage
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                setSendMessage(data)
            }).catch(e => console.log(e));
    }

    const friendList = conversations.map(i => (
        <div key={i._id} onClick={() => setChat(i)}>
            <FriendList conversation={i.members} userID={user.id} />
        </div >
    ))
    const messageList = messagesList.map(i => (
        <li key={i._id}>
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
                {friendList}
            </div>
            <div className="column middle">
                {chat._id ? (
                    <div className="chatBox">
                        <div className="chatBoxMessages">
                            <ul>
                                {messageList}
                            </ul>
                        </div>
                        <div className="chatBoxSend">
                            <form onSubmit={handleMessageSubmite}>
                                <div className='form-group'>
                                    <label>
                                        <textarea
                                            id='newMessage'
                                            name='newMessage'
                                            placeholder="Send Message"
                                            className="ChatMessageInpute"
                                            autoComplete='off'
                                            required />
                                    </label>
                                </div>
                                <button type='submit' className="messageSubmite">Send</button>
                            </form>
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
