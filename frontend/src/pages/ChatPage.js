import React, { useRef, useEffect, useState } from "react";
import "./ChatPage.css";
import FriendList from "../components/Messanger/FriendList"
import Message from "../components/Messanger/Message"
import FriendOnline from '../components/Messanger/FriendOnline'
import io from 'socket.io-client';

const ChatPage = () => {
    const [conversations, setConversations] = useState([])
    const [chat, setChat] = useState({ _id: null })
    const [messagesList, setMessagesList] = useState([])
    const [sendMessage, setSendMessage] = useState("")
    const user = { "id": "6446fc4cd7172792920794e0", "name": "Bob1", "username": "Bob1" }
    const scrollMessageRef = useRef(null);
    const socketRef = useRef();
    //connecting to socket
    useEffect(() => {
        socketRef.current = io('http://localhost:4000');
        return () => {
            socketRef.current.disconnect();
        };
    }, []);
    //add user to socket
    useEffect(() => {
        socketRef.current.emit("userJoined", user.id)
        socketRef.current.on("returnUser", users => {
            console.log(users)
        })
    }, []);
    //show conversations of user
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
    //show messages of user and his friend
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
                    }).catch(e => {
                        console.log(e)
                    });
            }
        }
        conversationsData()
    }, [chat]);
    //submite new message to a friend
    const getFriendId = (userId) => {
        const pair = chat.members.find(pair => pair.includes(userId));
        return pair ? chat.members.find(id => id !== userId) : null;
    };
    const handleMessageSubmite = async (event) => {
        event.preventDefault();
        //create message
        //conversationId, userdId, text
        const friendId = getFriendId(user.id);
        const newMessage = document.getElementById('newMessage').value;
        socketRef.current.emit("sendMessage", (user.id, friendId, newMessage));
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
                setMessagesList([...messagesList, data])
                setSendMessage("")
            }).catch(e => console.log(e));
    }
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    //current useEffect answering for scrolling down if new message coming in
    useEffect(() => {
        if (scrollMessageRef.current) {
            scrollMessageRef.current.scrollIntoView({ behavior: 'instant' });
        }
    }, [messagesList]);
    const friendList = conversations.map(i => (
        <div key={i._id} onClick={() => setChat(i)}>
            <FriendList conversation={i.members} userID={user.id} />
        </div >
    ))
    let messageList = []
    if (messagesList.length !== 0) {
        messageList = messagesList.map(i => (
            <li key={i._id} ref={scrollMessageRef}>
                <Message
                    ConversationId={i.ConversationId}
                    UserdId={i.UserdId}
                    Text={i.Text}
                    Time={i.Time}
                    own={i.UserdId === user.id}
                />
            </li>
        ))
    }
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
                        <div className="chatBoxMessageSend">
                            <form onSubmit={handleMessageSubmite}>
                                <div className='form-group'>
                                    <label>
                                        <textarea
                                            value={sendMessage}
                                            onChange={(event) => setSendMessage(event.target.value)}
                                            id='newMessage'
                                            name='newMessage'
                                            placeholder="Send Message"
                                            className="ChatMessageInpute"
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
