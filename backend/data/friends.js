import { users } from "../config/mongoCollections.js";
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
      if (fromPerson.requests.includes(o._id)) {
        o["status"] = 0;
      } else if (fromPerson.friendList.includes(o._id)) {
        o["status"] = 1;
      } else if (fromPerson.sentRequests.includes(o._id)) {
        o["status"] = 0;
      } else o["status"] = -1;

      res.push(o);
    }
  }

  res = res.filter((o) => o._id !== from);

  console.log(res);

  return res;
};

export const getRequests = async (uid) => {
  const usersCollection = await users();
  const data = await usersCollection.findOne({ _id: uid });
  if (data == null) {
    throw "Invalid request";
  }
  let requests = data.requests ? data.requests : [];
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
  if (user == null) {
    throw "Invalid request";
  }
  let flist = user.friendList ? user.friendList : [];
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
  const doc1 = await userCollection.findOne({ _id: uid });

  let requests = doc.requests;
  let sentRequests = doc1.sentRequests;
  if (Array.isArray(requests)) {
    if (requests.indexOf(uid) == -1) {
      requests.push(uid);
    }
  }

  if (Array.isArray(sentRequests)) {
    if (sentRequests.indexOf(uid) == -1) {
      sentRequests.push(targetId);
    }
  }

  const update1Info = await userCollection.updateOne(
    { _id: uid },
    { $set: { sentRequests: sentRequests } }
  );

  const updateInfo = await userCollection.updateOne(
    { _id: targetId },
    { $set: { requests: requests } }
  );

  if (updateInfo.modifiedCount == 0 || update1Info.modifiedCount == 0) {
    throw "Error";
  }

  return "Request Added";
};

export const acceptRequest = async (targetId, uid) => {
  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: targetId });
  const user1 = await usersCollection.findOne({ _id: uid });
  if (user == null || user1 == null) {
    throw "Invalid request";
  }

  let requests = user.requests ? user.requests : [];
  let friendList = user.friendList ? user.friendList : [];
  let sentRequests = user1.sentRequests ? user1.sentRequests : [];

  let sentRequests1 = user1.sentRequests ? user1.sentRequests : [];
  let friendList1 = user1.friendList ? user1.friendList : [];
  let requests1 = user1.requests ? user1.requests : [];

  if (friendList.includes(uid) && friendList1.includes(targetId)) {
    requests1.splice(requests1.indexOf(uid), 1);
    requests.splice(requests.indexOf(uid), 1);

    return "Already added";
  } else {
    if (requests.includes(uid)) {
      requests.splice(requests.indexOf(uid), 1);
      friendList.push(uid);
    }

    if (requests1.includes(targetId)) {
      requests1.splice(requests1.indexOf(uid), 1);
    }
    if (sentRequests1.includes(targetId)) {
      sentRequests1.splice(sentRequests1.indexOf(targetId), 1);
      friendList1.push(targetId);
    }
  }

  const updated1Info = await usersCollection.updateOne(
    { _id: uid },
    {
      $set: {
        sentRequests: sentRequests1,
        friendList: friendList1,
        requests: requests1,
      },
    }
  );

  const updatedInfo = await usersCollection.updateOne(
    { _id: targetId },
    {
      $set: {
        requests: requests,
        friendList: friendList,
        sentRequests: sentRequests,
      },
    }
  );
  if (updatedInfo.modifiedCount == 0 || updated1Info.modifiedCount == 0) {
    throw "Error Occurred";
  }
  return "Added";
};

export const removeFriend = async (targetId, uid) => {
  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: targetId });
  let friendList = user.friendList;
  if (friendList.includes(uid)) {
    friendList.splice(friendList.indexOf(uid), 1);
  } else throw "Friend doesn't exist";

  const updatedInfo = await usersCollection.updateOne(
    { _id: targetId },
    {
      $set: {
        friendList: friendList,
      },
    }
  );
  if (updatedInfo.modifiedCount == 0) {
    throw "Error Occurred";
  }
  return "Removed";
};

export const declineRequest = async (targetId, uid) => {
  const userCollection = await users();
  const doc = await userCollection.findOne({ _id: targetId });

  let requests = doc.requests;
  if (Array.isArray(requests)) {
    const index = requests.indexOf(uid);
    if (index !== -1) {
      requests.splice(index, 1);
    }
  }
  const updateInfo = await userCollection.updateOne(
    { _id: targetId },
    { $set: { requests: requests } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw "Error";
  }

  return "Request Removed";
};
