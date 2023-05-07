import { abc, users } from "../config/mongoCollections.js";
import { getUserById } from "./users.js";

export const getAllPeople = async () => {
  const usersCollection = await users();

  let people = await usersCollection.find({}).toArray();

  if (Array.isArray(people)) {
    people.forEach((o) => {
      delete o.email;
      delete o.createdDate;
      delete o.requests;
    });
  }

  return people;
};

export const getRequests = async (uid) => {
  const usersCollection = await users();
  const requests = await usersCollection.findOne({ _id: uid });
  return requests.requests;
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

export const addRequest = async (targetId, uid) => {
  const userCollection = await users();
  const doc = await userCollection.findOne({ _id: targetId });

  let requests = doc.requests;
  if (Array.isArray(requests)) {
    if (requests.indexOf(uid) == -1) {
      requests.push(uid);
    }
  }
  const updateInfo = await userCollection.updateOne(
    { _id: targetId },
    { $set: { requests: requests } }
  );

  if (updateInfo.modifiedCount == 0) {
    throw "Error";
  }

  return "Request Added";
};
