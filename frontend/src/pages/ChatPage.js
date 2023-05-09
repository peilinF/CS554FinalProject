//https://github.com/safak/youtube/blob/chat-app/client/src/pages/messenger/Messenger.jsx
//I looked how to use set and get messages from top url.

import React, { useRef, useEffect, useState } from "react";
import "./ChatPage.css";
import FriendList from "../components/Messanger/FriendList";
import Message from "../components/Messanger/Message";
import FriendOnline from "../components/Messanger/FriendOnline";
import io from "socket.io-client";
import { getAuth } from "firebase/auth";
import MainLayout from "../layouts/MainLayout";
import { apiInstance } from "../utils/apiInstance";

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [chat, setChat] = useState({ _id: null });
  const [messagesList, setMessagesList] = useState([]);
  const [sendMessage, setSendMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollMessageRef = useRef(null);
  const socketRef = useRef();
  const auth = getAuth();
  const user = { id: auth.currentUser.uid, name: auth.currentUser.displayName };
  const [latLng, setLatLng] = useState({ lng: -74, lat: 40.7123 });
  //connecting to socket
  useEffect(() => {
    socketRef.current = io("http://localhost:4000");
    socketRef.current.on("getMessage", (data) => {
      setArrivalMessage({
        UserId: data.userId,
        Text: data.text,
        Time: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    if (messagesList.length !== 0) {
      arrivalMessage &&
        chat?.members.includes(arrivalMessage.UserId) &&
        setMessagesList((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, chat]);
  //add user to socket
  useEffect(() => {
    socketRef.current.emit("userJoined", user.id);
    // console.log("user.id", user.id);
    socketRef.current.on("returnUser", (users) => {
      // console.log("users", users);
    });
  }, []);
  //show conversations of user
  useEffect(() => {
    const conversationsData = async () => {
      await apiInstance
        .get(`/conversations/${user.id}`, {
          method: "Get",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => response.data)
        .then((data) => {
          setConversations(data);
        })
        .catch((e) => console.log(e));
    };
    conversationsData();
  }, [user.id]);
  //show messages of user and his friend
  useEffect(() => {
    const conversationsData = async () => {
      if (chat._id !== null) {
        await apiInstance
          .get(`/messages/${chat._id}`, {
            method: "Get",
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => response.data)
          .then((data) => {
            setMessagesList(data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };
    conversationsData();
  }, [chat]);
  //submite new message to a friend
  const getFriendId = (userId) => {
    const pair = chat.members.find((pair) => pair.includes(userId));
    return pair ? chat.members.find((id) => id !== userId) : null;
  };
  const handleMessageSubmite = async (event) => {
    event.preventDefault();
    const friendId = getFriendId(user.id);
    const newMessage = sendMessage.trim(); // trim() removes leading/trailing spaces
    console.log("user.id", user.id);
    console.log("friendId", friendId);

    if (!newMessage) {
      // if message is empty or contains only spaces
      alert("Please enter a valid message");
      return;
    }

    socketRef.current.emit("sendMessage", {
      userId: user.id,
      friendId: friendId,
      text: newMessage,
    });

    await apiInstance
      .post(`/messages`, {
        conversationId: chat._id,
        userId: user.id,
        text: newMessage,
      })
      .then((response) => response.data)
      .then((data) => {
        setMessagesList([...messagesList, data]);
        setSendMessage("");
      })
      .catch((e) => console.log(e));
  };

  //https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  //current useEffect answering for scrolling down if new message coming in
  useEffect(() => {
    if (scrollMessageRef.current) {
      scrollMessageRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messagesList]);
  let friendList = [];
  if (conversations.length !== 0) {
    friendList = conversations.map((i) => (
      <div key={i._id} onClick={() => setChat(i)}>
        <FriendList conversation={i.members} userID={user.id} />
      </div>
    ));
  }
  let messageList = [];
  if (messagesList.length !== 0) {
    messageList = messagesList.map((i) => (
      <li key={i.Time} ref={scrollMessageRef}>
        <Message Text={i.Text} Time={i.Time} own={i.UserId === user.id} />
      </li>
    ));
  }
  return (
    <MainLayout>
      {/* <Map latLng={latLng} setLatLng={setLatLng} /> */}
      <div className="row">
        <div className="column left">
          <h2>chatMenu</h2>
          {friendList}
        </div>
        <div className="column middle">
          {chat._id ? (
            <div className="chatBox">
              <div className="chatBoxMessages">
                <ul className="no-bullets">{messageList}</ul>
              </div>
              <div className="chatBoxMessageSend">
                <form className="chatBoxForm" onSubmit={handleMessageSubmite}>
                  <div className="messageInputContainer">
                    <label htmlFor="newMessage">
                      <textarea
                        value={sendMessage}
                        onChange={(event) => setSendMessage(event.target.value)}
                        id="newMessage"
                        name="newMessage"
                        placeholder="Send Message"
                        className="ChatMessageInput"
                        required
                      />
                    </label>
                  </div>
                  <div className="messageSubmitContainer">
                    <button type="submit" className="messageSubmite">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="chatNotOpen">No Chat Opened</div>
          )}
        </div>
        <div className="column right">
          <h2>Friend</h2>
          {chat?._id ? (
            <FriendOnline conversation={chat.members} userID={auth.currentUser.uid} />
          ) : (
            <div>No friend Open</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
