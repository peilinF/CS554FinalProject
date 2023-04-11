import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections";

import bcrypt from "bcrypt";

export const createUser = async (obj) => {
  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(obj);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw { status: 400, msg: "Error: Could not add user" };

  return await getUserById(insertInfo.insertedId);
};

export const loginUser = async ({ email, password }) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (user == null) {
    throw { status: 401, msg: "Error: Invalid Username or Password" };
  }
  let dbPass = validValue(user.password);

  const validPassword = await bcrypt.compare(password, dbPass);

  if (validPassword) return user;
  else throw { status: 401, msg: "Error: Invalid Username or Password" };
};

const getUserById = async (id) => {
  const userCollection = await users();

  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  return user;
};
