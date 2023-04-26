const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
const { ObjectId } = require('mongodb');
const bcrypt = require("bcrypt");
const saltRounds = 6;

const utils = require("../utils");

const createUser = async (user_info) => {

    // error check

    let name = utils.checkName(user_info.name);
    let username = utils.checkUsername(user_info.username);
    let password = utils.checkPassword(user_info.password);

    // check if username already in database

    let username_in_use = await getUserByUsername(username);
    if (username_in_use) {
        throw "Username already in use";
    }

    // create user

    const userCollection = await user();

    let hashedPassword = await bcrypt.hash(password, saltRounds);

    let new_user = {
        name: name,
        username: username,
        password: hashedPassword,
        avatar: user_info.avatar, // Add avatar URL to the user document
        friends: [],
        lastPosition: {
            lat: 40.744838 + (Math.random() - 0.1) * 2,
            lng: -74.025683 + (Math.random() - 0.1) * 2
        },
    }

    const insertInfo = await userCollection.insertOne(new_user);
    if (insertInfo.insertedCount === 0) throw "Could not add user";

    const newId = insertInfo.insertedId.toString();

    // get user info

    const user_db = await getUserById(newId);
    user_db._id = user_db._id.toString();

    // remove password

    delete user_db.password;

    return user_db;
};


const checkUser = async (user_info) => {

    // error check

    username = utils.checkUsername(user_info.username);
    password = utils.checkPassword(user_info.password);

    // check if username in database

    let user_db = await getUserByUsername(username);
    if (!user_db) {
        throw "User not found";
    }

    // check password

    let match = await bcrypt.compare(password, user_db.password);
    if (!match) {
        throw "Incorrect password";
    }

    // return user document

    user_db._id = user_db._id.toString();
    delete user_db.password;

    return user_db;

};

const getUserById = async (id) => {

    // error check

    id = utils.checkId(id);

    // get user

    const userCollection = await user();

    const findUser = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!findUser) return null;

    findUser._id = findUser._id.toString();
    return findUser;

};

const getUserByUsername = async (username) => {

    username = utils.checkUsername(username);

    const userCollection = await user();
    const findUser = await userCollection.findOne({ username: { $regex: username, $options: 'i' } });

    if (!findUser) return null;

    findUser._id = findUser._id.toString();
    return findUser;

};

const getAllUsers = async () => {

    const userCollection = await user();
    const allUsers = await userCollection.find({}).toArray();
    if (!allUsers) return [];

    for (i in allUsers) {
        allUsers[i]._id = allUsers[i]._id.toString();
    }

    return allUsers;

};

const deleteUser = async (id) => {

    // error check

    id = utils.checkId(id);

    // check if user exists

    let user_db = await getUserById(id);
    if (!user_db) {
        throw "User not found";
    }

    // delete user

    const userCollection = await user();
    const deletionInfo = await userCollection.removeOne({ _id: new ObjectId(id) });

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with id of ${id}`;
    }

};

const addFriend = async (id, friend_id) => {

    // error check

    id = utils.checkId(id);
    friend_id = utils.checkId(friend_id);

    // check if user exists

    let user_db = await getUserById(id);
    if (!user_db) {
        throw "User not found";
    }

    // check if friend exists

    let friend_db = await getUserById(friend_id);
    if (!friend_db) {
        throw "Friend not found";
    }

    // check if friend already added

    if (user_db.friends.includes(friend_id)) {
        throw "Friend already added";
    }

    // check if user is already added as friend

    if (friend_db.friends.includes(id)) {
        throw "Friend already added";
    }

    // add friend

    const userCollection = await user();
    const updateInfo = await userCollection.updateOne({ _id: new ObjectId(id) }, { $addToSet: { friends: friend_id } });

    // add user as friend

    const updateInfo2 = await userCollection.updateOne({ _id: new ObjectId(friend_id) }, { $addToSet: { friends: id } });

    if (updateInfo.modifiedCount === 0 || updateInfo2.modifiedCount === 0) {
        throw `Could not add friend with id of ${friend_id}`;
    }

    return await getUserById(id);

};

const removeFriend = async (id, friend_id) => {

    // error check

    id = utils.checkId(id);
    friend_id = utils.checkId(friend_id);

    // check if user exists

    let user_db = await getUserById(id);
    if (!user_db) {
        throw "User not found";
    }

    // check if friend exists

    let friend_db = await getUserById(friend_id);
    if (!friend_db) {
        throw "Friend not found";
    }

    // check if friend already added

    if (!user_db.friends.includes(friend_id)) {
        throw "Friend not added";
    }

    // check if user is already added as friend

    if (!friend_db.friends.includes(id)) {
        throw "Friend not added";
    }

    // remove friend

    const userCollection = await user();
    const updateInfo = await userCollection.updateOne({ _id: new ObjectId(id) }, { $pull: { friends: friend_id } });

    // remove user as friend

    const updateInfo2 = await userCollection.updateOne({ _id: new ObjectId(friend_id) }, { $pull: { friends: id } });

    if (updateInfo.modifiedCount === 0 || updateInfo2.modifiedCount === 0) {
        throw `Could not remove friend with id of ${friend_id}`;
    }

    return await getUserById(id);
};

const getFriendsList = async (id) => {

    // error check

    id = utils.checkId(id);

    // check if user exists

    let user_db = await getUserById(id);
    if (!user_db) {
        throw "User not found";
    }

    // get friends list

    let friends_list = user_db.friends.map(async (friend_id) => {
        return await getUserById(friend_id);
    });

    return await Promise.all(friends_list);

};

const getUserPosition = async (id) => {

    // error check

    id = utils.checkId(id);

    // check if user exists

    let user_db = await getUserById(id);
    if (!user_db) {
        throw "User not found";
    }

    // get user position

    return user_db.lastPosition;

};

const updateUserPosition = async (id, position) => {

    // error check

    id = utils.checkId(id);

    // check if user exists

    let user_db = await getUserById(id);
    if (!user_db) {
        throw "User not found";
    }

    // check if position changed

    if (user_db.lastPosition.lat === position.lat && user_db.lastPosition.lng === position.lng) {
        throw "Position not changed";
    }

    // update user position

    const userCollection = await user();
    const updateInfo = await userCollection.updateOne({ _id: new ObjectId(id) }, { $set: { lastPosition: position } });

    if (updateInfo.modifiedCount === 0) {
        throw `Could not update user with id of ${id}`;
    }

    return await getUserById(id);

};

module.exports = {
    createUser,
    checkUser,
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