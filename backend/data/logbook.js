import { v4 as uuid } from "uuid";
import { users } from "../config/mongoCollections.js";

import { getUserById } from "./users.js";
import utils from "../utils.js";

const createLog = async (userId, log_info) => {
    // check user
    try {
        const user_db = await getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;
    } catch (error) {
        throw error;
    }

    // check log
    let { date, time, routeInfo, notes } = log_info;

    try {
        date = utils.checkDate(date);
        time = utils.checkTime(time);
        routeInfo.route = utils.checkRoute(routeInfo.route);
        notes = utils.checkNotes(notes);
    } catch (error) {
        console.log(error);
        throw error;
    }


    // get other info
    let unit = 'mi';
    let distance = utils.getDistance(routeInfo.route, unit);
    let pace = utils.getPace(distance, time, unit);

    // create log
    let log = {
        _id: uuid(),
        date: date,
        time: time,
        distance: distance,
        pace: pace,
        routeInfo: routeInfo,
        notes: notes
    };

    // add log to user
    try {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $push: { logbook: log } }
        );
        if (updateInfo.modifiedCount === 0) throw "Could not add log to user";
    } catch (error) {
        throw error;
    }

    return await getLogById(userId, log._id.toString());
};

const getLogById = async (userId, logId) => {

    console.log("getLogById: ", userId, logId);

    let user_db = null;
    try {
        user_db = await getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;
    } catch (error) {
        throw error;
    }

    try {
        let log_db = user_db.logbook.find(log => log._id.toString() === logId.toString());
        if (!log_db) throw `Log with id ${logId} does not exist`;

        return log_db;
    } catch (error) {
        throw error;
    }
};

const getAllLogs = async (userId) => {
    let user_db = null;

    try {
        user_db = await getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;
    } catch (error) {
        throw error;
    }

    return user_db.logbook;
};

const updateLog = async (userId, logId, log_info) => {

    let user_db = null;
    let log_db = null;

    // check user and log
    try {
        user_db = await getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;

        log_db = await getLogById(userId, logId);
        if (!log_db) throw `Log with id ${logId} does not exist`;
    } catch (error) {
        throw error;
    }

    console.log("finish check user and log");

    // check log
    let { date, time, routeInfo, notes } = log_info;

    try {
        date = utils.checkDate(date);
        time = utils.checkTime(time);
        routeInfo.route = utils.checkRoute(routeInfo.route);
        notes = utils.checkNotes(notes);
    } catch (error) {
        console.log(error);
        throw error;
    }


    // get other info
    let unit = 'mi';
    let distance = utils.getDistance(routeInfo.route, unit);
    let pace = utils.getPace(distance, time, unit);

    // create log
    let log = {
        _id: logId,
        date: date,
        time: time,
        distance: distance,
        pace: pace,
        routeInfo: routeInfo,
        notes: notes
    };

    console.log("new log: ", log);

    // update log in user
    try {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId, "logbook._id": logId },
            { $set: { "logbook.$": log } }
        );
        if (updateInfo.modifiedCount === 0) throw "Could not update log";
    } catch (error) {
        console.log(error);
        throw error;
    }

    log_db = await getLogById(userId, logId);

    if (!log_db) {
        console.log("log_db is null");
    }
    return log_db;
};

const deleteLog = async (userId, logId) => {

    let user_db = null;
    let log_db = null;

    // check user and log
    try {
        user_db = await getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;

        log_db = await getLogById(userId, logId);
        if (!log_db) throw `Log with id ${logId} does not exist`;
    } catch (error) {
        throw error;
    }

    console.log("finish check user and log");

    // delete log
    try {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $pull: { logbook: { _id: logId } } }
        );

        if (updateInfo.modifiedCount === 0) throw "Could not delete log";
    } catch (error) {
        throw error;
    }

    return { logId: logId, deleted: true };

};

export default {
    createLog,
    getLogById,
    getAllLogs,
    updateLog,
    deleteLog
};