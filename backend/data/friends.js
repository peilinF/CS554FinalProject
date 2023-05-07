import { abc, users } from "../config/mongoCollections.js";
import { getUserById } from "./users.js";

export const getAllPeople = async (from) => {
  const usersCollection = await users();

  let people = await usersCollection.find({}).toArray();

  let fromPerson = people.find((o) => o._id == from);

  let res = [];

  if (Array.isArray(people)) {
    for (let i = 0; i < people.length; i++) {
      let o = people[i];
      delete o.email;
      delete o.createdDate;
      if (fromPerson.friendList.includes(o._id)) {
        o["status"] = 1;
      } else if (fromPerson.requests.includes(o._id)) {
        o["status"] = 0;
      } else o["status"] = -1;

      res.push(o);
    }
  }

  res = res.filter((o) => o._id !== from);

  return res;
};

export const getRequests = async (uid) => {
  const usersCollection = await users();
  const data = await usersCollection.findOne({ _id: uid });

  let requests = data.requests;
  let result = [];

  for (let i = 0; i < requests.length; i++) {
    let udata = await getUserById(requests[i]);
    if (udata !== null) {
      result.push(udata);
    }
  }

  return result;
};

export const myFriends = async (uid) => {
  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: uid });
  let flist = user.friendList;
  let result = [];

  for (let i = 0; i < flist.length; i++) {
    let udata = await getUserById(flist[i]);
    if (udata !== null) {
      result.push(udata);
    }
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

export const acceptRequest = async (targetId, uid) => {
  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: targetId });
  let requests = user.requests;
  let friendList = user.friendList;
  if (requests.includes(uid)) {
    requests.splice(requests.indexOf(uid), 1);
    friendList.push(uid);
  } else throw "Request doesn't exist";

  const updatedInfo = await usersCollection.updateOne(
    { _id: targetId },
    {
      $set: {
        requests: requests,
        friendList: friendList,
      },
    }
  );
  if (updatedInfo.modifiedCount == 0) {
    throw "Error Occurred";
  }
  return "Added";
};
