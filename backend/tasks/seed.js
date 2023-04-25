const connection = require('../config/mongoConnection');
const data = require('../data/');

const userData = data.user;
const cacheData = data.cache;

const main = async () => {

    // drop database
    const db = await connection.dbConnection();
    await db.dropDatabase();

    // clear cache
    await cacheData.clearCache();

    // create users
    let user1 = {
        name: "John Doe",
        username: "johndoe",
        password: "JohnDoe123#",
        avatar: "https://gravatar.com/avatar/a89a462a59832816c24b60da1a543bc4?s=400&d=robohash&r=x"
    }
    let user2 = {
        name: "Jane Doe",
        username: "janedoe",
        password: "JaneDoe123#",
        avatar: "https://gravatar.com/avatar/095553178fc52fbf4f69a46910621cbd?s=400&d=robohash&r=x"
    }

    let user3 = {
        name: "John Wick",
        username: "johnwick",
        password: "JohnWick123#",
        avatar: "https://gravatar.com/avatar/e15b35a0157c0001e00810224efd44cf?s=400&d=robohash&r=x"
    }

    let user4 = {
        name: "Mark Kevin",
        username: "markkevin",
        password: "MarkKevin123#",
        avatar: "https://gravatar.com/avatar/ba8d3e722d0cdddd8f701600634a1267?s=400&d=robohash&r=x"
    }

    let user1_db = await userData.createUser(user1);
    let user2_db = await userData.createUser(user2);
    let user3_db = await userData.createUser(user3);

    // close connect
    await connection.closeConnection();
    console.log('Done seeding database');
    await cacheData.closeConnection();

};

main().catch((error) => {
    console.error(error);
    return connection.dbConnection().then((db) => {
        return connection.closeConnection();
    });
});