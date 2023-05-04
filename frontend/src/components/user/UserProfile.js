import '../App.css';

import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';
import queries from '../../graphql/queries';

import { apiInstance } from '../../utils/apiInstance';

import { useSelector, useDispatch } from 'react-redux';
import { chatroomActions } from '../../actions';

const UserProfile = (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // console.log("user profile props", props.userInfo);

    const [searchTerm, setSearchTerm] = useState("");

    // create a list of the user's friends
    
    const { loading, error, data, refetch } = useQuery(queries.GET_FRIENDS_LIST, {
        variables: { userId: props.userInfo._id },
        fetchPolicy: 'cache-and-network'
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    // add or remove friend to user's friends list

    const handleAddFriend = async (event) => {

        event.preventDefault();

        try {
            const response = await apiInstance.get(`/users/addfriend/${props.userInfo._id}/${searchTerm}`);
            // console.log(response.data);
        } catch (error) {
            console.log(error);
        }

        refetch();
    };

    const handleDelete = async (event, friendId) => {

        event.preventDefault();

        try {
            const response = await apiInstance.get(`/users/removefriend/${props.userInfo._id}/${friendId}`);
            // console.log(response.data);
        } catch (error) {
            console.log(error);
        }

        refetch();
    };

    const startChat = async (userId, friendId) => {

        console.log("start chat between ", userId, friendId);

        dispatch(chatroomActions.joinChatroom([userId, friendId]));

        // navigate('/chat', { state: { userId: userId, friendId: friendId } });

    };

    // create a list of the user's friends

    let friends_list = data.getFriendsList.map((friend) => {
        // console.log("friend", friend);
        return (
            <li key={friend._id} className="friends-list" onClick={() => {
                startChat(props.userInfo._id, friend._id);
            }}>
                <div className="friends-info">
                    <img src={friend.avatar} alt="" width="30px" height="30px"/>
                    <p>{friend.name}</p>
                </div>
                <div className="function-button">
                    <button
                        className="delete-btn"
                        onClick={async (event) => handleDelete(event, friend._id)}
                    >
                            X
                    </button>
                </div>
            </li>
        );
    });

    let html = (
        <div className="user-profile">
            <h2>User Profile</h2>
            <img src={props.userInfo.avatar} alt="" width="400px" height="400px"/>

            <br />
            <br />

            <h3>User Name:</h3>
            <p>{props.userInfo.name}</p>
            <h3>User Id:</h3>
            <p>{props.userInfo._id}</p>
            {/* <h3>LastPosition:</h3>
            <p>{props.userInfo.lastPosition.lat}, {props.userInfo.lastPosition.lng}</p> */}

            <br />
            <br />

            <h2>Friends List</h2>

            <form onSubmit={(event) => handleAddFriend(event)} className="add-friend-input">
                <input
                    type="text"
                    id="userid"
                    placeholder="Input user Id to add a new friend."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required
                />
                <button type="submit" className="submit-btn">Add Friend</button>
            </form>

            <br />
            <ul className="friends-list-ul">{friends_list}</ul>
        </div>
    );

    return html;
};

export default UserProfile;