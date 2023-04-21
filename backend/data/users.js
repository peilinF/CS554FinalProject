import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";


import bcrypt from "bcrypt";
const saltRounds = 16;

export const createUser = async (name, username, password) => {
  const userCollection = await users();
  //fix later
  password = await bcrypt.hash(password, saltRounds);
  let usernameDuplication = await userCollection.findOne({ "username": username });
  if (usernameDuplication !== null) throw 'Username already exists';
  let newUser = {
    name: name,
    username: username,
    password: password
  };
  const newInsertInformation = await userCollection.insertOne(newUser);
  if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
  return {
    name: name,
    username: username,
  };
};

export const loginUser = async (username, password) => {
  //validation start
  username = username
  password = password
  const userCollection = await users();
  let usernameInfo = await userCollection.findOne({ "username": username });
  if (usernameInfo === null) throw 'Either the username or password is invalid';
  let temp = await bcrypt.compare(password, usernameInfo.password);
  if (temp === false) throw 'Either the username or password is invalid';
  return { id: usernameInfo._id, name: usernameInfo.name }
};

export const getUserById = async (id) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  return user;
};
