import '../App.css';
import './chat.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';
import queries from '../../graphql/queries';

import { useSelector, useDispatch } from 'react-redux';
import { chatroomActions } from '../../redux/actions';

import io from 'socket.io-client';
import { socketio_url, apiInstance } from '../../utils/apiInstance';

import { getAuth } from 'firebase/auth';

const Chat = () => {

    const auth = getAuth();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [infoState, setInfoState] = useState(null);
    const [usersInfo, setUsersInfo] = useState(null);

    // get selected chatroom

    const selectedChatroom = useSelector((state) => state.chatroom.selectedChatroom);

    // get user's info

    const { loading, error, data, refetch } = useQuery(queries.GET_USERS_INFO, {
        variables: {
            usersId: selectedChatroom ? selectedChatroom.users : [],
        },
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (data) {
            // console.log("users info: ", data);
            setUsersInfo(data.getUsersInfo);
        }
    }, [data]);

    // connect to socket

    useEffect(() => {
        const newSocket = io(socketio_url);
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket]);

    // join chatroom

    useEffect(() => {
        const joinChatroom = async () => {
            if (socket && selectedChatroom) {
                socket.emit('join room', selectedChatroom.id);
            }
        };

        joinChatroom();
    }, [usersInfo, selectedChatroom]);

    // function of add new message to page

    let input = document.querySelector('.chatroom-input');
    let messages = document.querySelector('.messages');

    const addMessageToPage = (info) => {
        if (!info) {
            console.log("info is null");
            return;
        }
        const li = document.createElement('li');
        li.textContent = `${info.username}: ${info.message}`;
        messages.appendChild(li);

        // scroll to bottom
        messages.scrollTop = messages.scrollHeight;
    };

    useEffect(() => {
        if (infoState) {
            addMessageToPage(infoState);
        }
    }, [infoState]);
    
    // listen for new messages, and call function of add new message to page

    if (socket) {
        socket.on('newMessage', (data) => {
            // console.log(data, infoState);

            // prevent duplicate message
            if (data === infoState) return;                                 

            // add new message to page
            setInfoState(data);
        });
    }

    // function of send message
    
    const sendMessage = async (event) => {
        event.preventDefault();

        if (!message.trim()) return;

        let info = {
            username: (auth && auth.currentUser) ? auth.currentUser.displayName : null,
            message: message,
        };

        input.value = '';
        setMessage('');
        input.focus();

        // send message to server

        try {
            if (socket && selectedChatroom) {
                socket.emit('newMessage', {
                    roomId: selectedChatroom.id,
                    info: info,
                });
            } else {
                throw "socket or selectedChatroom is null";
            }
        } catch (err) {
            addMessageToPage(info);
            addMessageToPage({
                username: 'System',
                message: "Failed to send message to server",
            });
        }
    };

    // render chatroom page

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    let chat_html = (
        <div>
            {selectedChatroom ? (
                <div className="chatroom-body">
                    <ul className="messages"></ul>
                    <input type="text"
                        className="chatroom-input"
                        autoComplete='off'
                        autoFocus
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? sendMessage(e) : null}
                    />
                    <button
                        className="send"
                        onClick={(e) => sendMessage(e)}
                    >Send</button>
                </div>
            ) : (
                <p>no selected chatroom</p>
            )}
        </div>
    );

    let html = (
        <div className="chatroom">
            <div className="chatroom-header">
                <h1>Chat</h1>
            </div>
            {chat_html}
        </div>
    );

    return html;

};

export default Chat;

