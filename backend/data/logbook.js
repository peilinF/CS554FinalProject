import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";

import usersData from "./users.js";
import utils from "../utils.js";

const createLog = async (userId, log_info) => {
    // check user
    try {
        const user_db = await usersData.getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;
    } catch (error) {
        throw error;
    }

    // check log
    let { date, time, route, notes } = log_info;

    try {
        date = utils.checkDate(date);
        time = utils.checkTime(time);
        route = utils.checkRoute(route);
        notes = utils.checkNotes(notes);
    } catch (error) {
        throw error;
    }

    // get other info
    let unit = 'mi';
    let distance = utils.getDistance(route, unit);
    let pace = utils.getPace(distance, time, unit);

    // create log
    let log = {
        _id: new ObjectId(),
        date: date,
        time: time,
        distance: distance,
        pace: pace,
        route: route,
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
    let user_db = null;
    try {
        user_db = await usersData.getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;
    } catch (error) {
        throw error;
    }

    try {
        let log_db = user_db.logbook.find(log => log._id.toString() === logId);
        if (!log_db) throw `Log with id ${logId} does not exist`;

        return log_db;
    } catch (error) {
        throw error;
    }
};

const getAllLogs = async (userId) => {
    let user_db = null;

    try {
        user_db = await usersData.getUserById(userId);
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
        user_db = await usersData.getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;

        log_db = await getLogById(userId, logId);
        if (!log_db) throw `Log with id ${logId} does not exist`;
    } catch (error) {
        throw error;
    }

    // check log info
    let { date, time, route, notes } = log_info;

    try {
        date = utils.checkDate(date);
        time = utils.checkTime(time);
        route = utils.checkRoute(route);
        notes = utils.checkNotes(notes);
    } catch (error) {
        throw error;
    }

    // get other info
    let unit = 'mi';
    let distance = utils.getDistance(route, unit);
    let pace = utils.getPace(distance, time, unit);

    // update log
    let log = {
        _id: log_db._id,
        date: date,
        time: time,
        distance: distance,
        pace: pace,
        route: route,
        notes: notes
    };

    // update log in user
    try {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId, "logbook._id": logId },
            { $set: { "logbook.$": log } }
        );
        if (updateInfo.modifiedCount === 0) throw "Could not update log";
    } catch (error) {
        throw error;
    }

    return await getLogById(userId, logId);
};

const deleteLog = async (userId, logId) => {

    let user_db = null;
    let log_db = null;

    // check user and log
    try {
        user_db = await usersData.getUserById(userId);
        if (!user_db) throw `User with id ${userId} does not exist`;

        log_db = await getLogById(userId, logId);
        if (!log_db) throw `Log with id ${logId} does not exist`;
    } catch (error) {
        throw error;
    }

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