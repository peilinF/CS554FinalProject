import { abc, users } from "../config/mongoCollections.js";
import { getUserById } from "./users.js";

export const getAllPeople = async () => {
  const usersCollection = await users();

  let people = await usersCollection.find({}).toArray();

  if (Array.isArray(people)) {
    people.forEach((o) => {
      delete o.email;
      delete o.createdDate;
    });
  }

  return people;
};

export const getRequests = async (uid) => {
  const requestsCollection = await abc();
  const requests = await requestsCollection.find({ _id: uid }).toArray();
  return requests;
};

export const myFriends = async (uid) => {
  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: uid });
  let flist = user.friendList;
  let result = [];
  if (Array.isArray(flist)) {
    flist.forEach(async (id) => {
      let udata = await getUserById(id);
      result.push(udata);
    });
  }

  return result;
};
