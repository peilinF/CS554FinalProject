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
        avatar: user_info.avatar // Add avatar URL to the user document
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

module.exports = {
    createUser,
    checkUser,
    getUserById,
    getUserByUsername,
    getAllUsers,
    deleteUser
}