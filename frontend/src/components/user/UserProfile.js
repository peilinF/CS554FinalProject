import '../App.css';

import React, {useState} from 'react';

import { useQuery, useMutation } from '@apollo/client';
import queries from '../../graphql/queries';

import axios from 'axios';

const UserProfile = (profs) => {

    const [searchTerm, setSearchTerm] = useState("");

    // create a list of the user's friends

    const { loading, error, data, refetch } = useQuery(queries.GET_FRIENDS_LIST, {
        variables: { userId: profs.userInfo._id },
        fetchPolicy: 'cache-and-network'
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    // create a list of the user's friends

    const handleDelete = async (event, friendId) => {

        event.preventDefault();

        try {
            const response = await axios.get(`http://localhost:4000/removefriend/${profs.userInfo._id}/${friendId}`);
            // console.log(response.data);
        } catch (error) {
            console.log(error);
        }

        refetch();
    };

    let friends_list = data.getFriendsList.map((friend) => {
        return (
            <li key={friend._id} className="friends-list" onClick={() => {
                console.log(friend.username);
            }}>
                <div className="friends-info">
                    <img src={friend.avatar} alt="" width="30px" height="30px"/>
                    <p>{friend.username}</p>
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

    // add friend to user's friends list

    const handleSearch = async (event) => {

        event.preventDefault();

        try {
            const response = await axios.get(`http://localhost:4000/addfriend/${profs.userInfo._id}/${searchTerm}`);
            // console.log(response.data);
        } catch (error) {
            console.log(error);
        }

        refetch();
    };

    let html = (
        <div className="user-profile">
            <h2>User Profile</h2>
            <img src={profs.userInfo.avatar} alt="" />

            <br />

            <h3>Username:</h3>
            <p>{profs.userInfo.username}</p>
            <h3>User Id:</h3>
            <p>{profs.userInfo._id}</p>

            <br />
            <br />

            <h2>Friends List</h2>

            <form onSubmit={(event) => handleSearch(event)} className="add-friend-input">
                <input
                    type="text"
                    id="userid"
                    placeholder="Input user Id to add a new friend."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required
                />
                <button type="submit" className="submit-btn">Add Friend</button>
            </form>

            <ul className="friends-list-ul">{friends_list}</ul>
        </div>
    );

    return html;
};

export default UserProfile;