import {v4 as uuid} from 'uuid';

import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import userData from '../data/users.js';
import logbookData from '../data/logbook.js';

import { generateFakeLogbook } from './generator.js';

// const cacheData = data.cache;

const main = async () => {

    // drop database
    const db = await dbConnection();
    await db.dropDatabase();

    // // clear cache
    // await cacheData.clearCache();

    // create users
    let user1 = {
        // id: uuid(),
        _id: "eoY26PwIDjMlRxKLXvvvkOYuwv32",
        name: "John Doe",
        email: "johndoe@gmail.com",     // password: JohnDoe123#
        avatarUrl: "https://gravatar.com/avatar/a89a462a59832816c24b60da1a543bc4?s=400&d=robohash&r=x"
    }
    let user2 = {
        // id: uuid(),
        _id: "jANh6rCdTAPPlECWPv9rwO74TQU2",
        name: "Jane May",
        email: "janemay@gmail.com",     // password: JaneMay123#
        avatarUrl: "https://gravatar.com/avatar/095553178fc52fbf4f69a46910621cbd?s=400&d=robohash&r=x"
    }

    let user3 = {
        // id: uuid(),
        _id: "vfrWIchebgMrIXBFAU3spxQyb3i1",
        name: "John Wick",
        email: "johnwick@123.com",      // password: JohnWick123#
        avatarUrl: "https://gravatar.com/avatar/e15b35a0157c0001e00810224efd44cf?s=400&d=robohash&r=x"
    }

    let user4 = {
        // id: uuid(),
        _id: "JtKg7SvgdbhUGNifieqyXrRThAA2",
        name: "Mark Kevin",
        email: "markkevin@123.com",     // password: MarkKevin123#
        avatarUrl: "https://gravatar.com/avatar/ba8d3e722d0cdddd8f701600634a1267?s=400&d=robohash&r=x"
    }

    let user1_db = await userData.createUser(user1);
    let user2_db = await userData.createUser(user2);
    let user3_db = await userData.createUser(user3);
    let user4_db = await userData.createUser(user4);

    // add freinds

    await userData.addFriend(user4_db.id, user1_db.id);
    await userData.addFriend(user4_db.id, user2_db.id);
    await userData.addFriend(user4_db.id, user3_db.id);

    await userData.addFriend(user3_db.id, user1_db.id);
    await userData.addFriend(user3_db.id, user2_db.id);

    // add logbook

    await logbookData.createLog(user1_db.id, generateFakeLogbook());
    await logbookData.createLog(user1_db.id, generateFakeLogbook());

    await logbookData.createLog(user2_db.id, generateFakeLogbook());

    await logbookData.createLog(user3_db.id, generateFakeLogbook());
    await logbookData.createLog(user3_db.id, generateFakeLogbook());
    await logbookData.createLog(user3_db.id, generateFakeLogbook());

    await logbookData.createLog(user4_db.id, generateFakeLogbook());
    await logbookData.createLog(user4_db.id, generateFakeLogbook());
    await logbookData.createLog(user4_db.id, generateFakeLogbook());
    await logbookData.createLog(user4_db.id, generateFakeLogbook());
    await logbookData.createLog(user4_db.id, generateFakeLogbook());

    // delete logbook
    // await logbookData.deleteLog(user4_db.id, '64527747846b790fc9b5c4ae');

    // close connect
    await closeConnection();
    console.log('Done seeding database');
    // await cacheData.closeConnection();

};

main().catch((error) => {
    console.error(error);
    return dbConnection().then((db) => {
        return closeConnection();
    });
});