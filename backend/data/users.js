import { users } from "../config/mongoCollections.js";

export const createUser = async (name, email, _id) => {
  const userCollection = await users();
  //fix later
  // password = await bcrypt.hash(password, saltRounds);
  let usernameDuplication = await userCollection.findOne({
    email: email,
  });
  if (usernameDuplication !== null) throw "Username already exists";
  const newUser = {
    _id: _id,
    name: name,
    email: email,
    createdDate: new Date().getTime(),
    friendList: [],
    requests: [],
    logbook: [],
    routes: [],
    sentRequests: [],
  };
  const newInsertInformation = await userCollection.insertOne(newUser);
  if (newInsertInformation.acknowledged != true) throw "Insert failed!";
  return await getUserById(newInsertInformation.insertedId);
};

// export const loginUser = async (username, password) => {
//   //validation start
//   username = username;
//   password = password;
//   const userCollection = await users();
//   let usernameInfo = await userCollection.findOne({ username: username });
//   if (usernameInfo === null) throw "Either the username or password is invalid";
//   // let temp = await bcrypt.compare(password, usernameInfo.password);
//   if (temp === false) throw "Either the username or password is invalid";
//   return { id: usernameInfo._id, name: usernameInfo.name };
// };

export const getUserById = async (id) => {
  try {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });
    return user;
  } catch (error) {
    throw error;
  }
};
