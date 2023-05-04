import '../App.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';
import queries from '../../graphql/queries';

import { useSelector, useDispatch } from 'react-redux';
import { chatroomActions } from '../../actions';

import io from 'socket.io-client';
import { socketio_url, apiInstance } from '../../utils/apiInstance';

const Chat = () => {

    const socket = io(socketio_url);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [usersInfo, setUsersInfo] = useState(null);
    const chatroomState = useSelector((state) => state.chatroom);

    console.log("selected chatroom: ", chatroomState.selectedChatroom);
    let selectedChatroom = chatroomState.chatrooms.find((chatroom) => {
        return chatroom.id === chatroomState.selectedChatroom;
    });
    let users = selectedChatroom.users;
    console.log("users: ", users);

    const {loading, error, refetch} = useQuery(queries.GET_USERS_INFO, {
        variables: { usersId: users },
        fetchPolicy: 'cache-and-network',
        skip: (users.length === 0),
        onCompleted: (data) => {
            // console.log(data);
            setUsersInfo(data.getUsersInfo);
        }
    })

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.log("usersInfo: ", usersInfo);

    let html = (
        <div className="chatroom">
            <div className="chatroom-header">
                <h1>Chat</h1>
            </div>
            <div className="chatroom-body">
                <p>{chatroomState.selectedChatroom}</p>
            </div>
        </div>
    );

    return html;

};

export default Chat;
