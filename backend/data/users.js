import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";

import bcrypt from "bcrypt";
const saltRounds = 16;

import utils from "../utils.js";

const createUser = async (user_info) => {

    let {name, email, _id, avatarUrl} = user_info;

    const userCollection = await users();

    // check if user already exists
    let user_db = undefined;
    try {
        user_db = await userCollection.findOne({ _id: _id });
        if (user_db) {
            throw "Error: user already exists";
        }
    } catch (e) {
        throw "Error: filed to find user";
    }

    // create new user

    const newUser = {
        _id: _id,
        name: name,
        email: email,
        createdDate: new Date().getTime(),
        avatar: avatarUrl,
        friendList: [],
        lastPosition: {
            lat: 40.744838 + (Math.random() - 0.1) * 2,
            lng: -74.025683 + (Math.random() - 0.1) * 2
        },
        logbook: []
    };

    // insert new user

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.acknowledged != true) throw "Insert failed!";

    // return new user


    let user_db2 = await getUserById(newInsertInformation.insertedId);

    if (!user_db2) throw "Error: failed to create user";

    return {id: user_db2._id, success: true};
};

const loginUser = async (username, password) => {
    //validation start
    username = username;
    password = password;
    const userCollection = await users();
    let usernameInfo = await userCollection.findOne({ username: username });
    if (usernameInfo === null) throw "Either the username or password is invalid";
    let temp = await bcrypt.compare(password, usernameInfo.password);
    if (temp === false) throw "Either the username or password is invalid";
    return { id: usernameInfo._id, name: usernameInfo.name };
};

const getUserById = async (id) => {
    if (!id) throw "You must provide an id to search for";

    try {
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });
        return user;
    } catch (error) {
        throw error;
    }
};

const getUserByUsername = async (username) => {
    try {
        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });
        return user;
    } catch (error) {
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (id) => {
    // check user
    try {
        const user_db = await getUserById(id);
        if (!user_db) throw `User with id ${id} does not exist`;
    } catch (error) {
        throw error;
    }

    // delete user from friend list
    try {
        const userCollection = await users();
        const updateInfo = await userCollection.updateMany(
            { friendList: id },
            { $pull: { friendList: id } }
        );
        if (updateInfo.modifiedCount === 0) throw "Could not delete user from friend list";
    } catch (error) {
        throw error;
    }

    // delete user
    try {
        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id}`;
        }
    } catch (error) {
        throw error;
    }
};

const addFriend = async (userId, friendId) => {
    try {
        const user_db = await getUserById(userId);
        const friend_db = await getUserById(friendId);

        if (!user_db) throw `User with id ${userId} does not exist`;
        if (!friend_db) throw `User with id ${friendId} does not exist`;
    } catch (error) {
        throw error;
    }

    try {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $addToSet: { friendList: friendId } }
        );
        if (updateInfo.modifiedCount === 0) throw "Could not add friend to user";

        const updateInfo2 = await userCollection.updateOne(
            { _id: friendId },
            { $addToSet: { friendList: userId } }
        );
        if (updateInfo2.modifiedCount === 0) throw "Could not add user to friend";

        return await getUserById(userId);
    } catch (error) {
        throw error;
    }
}

const removeFriend = async (userId, friendId) => {
    try {
        const user_db = await getUserById(userId);
        const friend_db = await getUserById(friendId);

        if (!user_db) throw `User with id ${userId} does not exist`;
        if (!friend_db) throw `User with id ${friendId} does not exist`;
    } catch (error) {
        throw error;
    }

    try {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $pull: { friendList: friendId } }
        );
        if (updateInfo.modifiedCount === 0) throw "Could not remove friend from user";

        const updateInfo2 = await userCollection.updateOne(
            { _id: friendId },
            { $pull: { friendList: userId } }
        );
        if (updateInfo2.modifiedCount === 0) throw "Could not remove user from friend";

        return await getUserById(userId);
    } catch (error) {
        throw error;
    }
}

const getFriendsList = async (userId) => {
    
    let user_db = undefined;
    try {
        user_db = await getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;
    } catch (error) {
        throw error;
    }

    try {
        let friends_list = user_db.friendList.map(async (friend_id) => {
            return await getUserById(friend_id);
        });
        return friends_list;
    } catch (error) {
        throw error;
    }
}

const getUserPosition = async (userId) => {
    try {
        const user_db = await getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;
    } catch (error) {
        throw error;
    }

    try {
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: userId });
        return user.lastPosition;
    } catch (error) {
        throw error;
    }
}

const updateUserPosition = async (userId, position) => {
    try {
        const user_db = await getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;
    } catch (error) {
        throw error;
    }

    try {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $set: { lastPosition: position } }
        );
        if (updateInfo.modifiedCount === 0) throw "Could not update user position";
    } catch (error) {
        throw error;
    }
}

export default {
    createUser,
    loginUser,
    getUserById,
    getUserByUsername,
    getAllUsers,
    deleteUser,
    addFriend,
    removeFriend,
    getFriendsList,
    getUserPosition,
    updateUserPosition
}