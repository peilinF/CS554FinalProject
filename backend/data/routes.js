import {v4 as uuid } from 'uuid';
import { users } from "../config/mongoCollections.js";

import { getUserById } from './users.js';
import utils from '../utils.js';

const createRoute = async (userId, directions) => {

    // check user

    try {
        const user_db = await getUserById(userId);
        if (!user_db) throw "User not found";
    } catch (error) {
        throw error;
    }

    // check logInfo

    let { route, ori_directions } = directions;

    try {
        route = utils.checkRoute(route);
    } catch (error) {
        throw error;
    }

    // create log
    let routeInfo = {
        _id: uuid(),
        route: route,
        ori_directions: ori_directions
    };

    try {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $push: { routes: routeInfo } }
        );
        console.log(updateInfo);
        if (updateInfo.modifiedCount === 0) throw "Could not add log";
    } catch (error) {
        throw error;
    }

    return await getRouteById(userId, routeInfo._id);

};

const getRouteById = async (userId, routeId) => {

    userId = utils.checkId(userId);
    routeId = utils.checkId(routeId);

    try {
        const user_db = await getUserById(userId);
        if (!user_db) throw "User not found";

        const route_db = user_db.routes.find((route) => route._id === routeId);
        if (!route_db) throw "Route not found";

        return route_db;
    } catch (error) {
        throw error;
    }

};

const getAllRoutes = async (userId) => {

    // check user

    let user_db = null;
    try {
        user_db = await getUserById(userId);
        if (!user_db) throw "User not found";
    } catch (error) {
        throw error;
    }

    return user_db.routes;

};

const deleteRoute = async (userId, routeId) => {

    try {
        const user_db = await getUserById(userId);
        if (!user_db) throw "User not found";

        const route_db = await getRouteById(userId, routeId);
        if (!route_db) throw "Route not found";
    } catch (error) {
        throw error;
    }

    try {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $pull: { routes: { _id: routeId } } }
        );
        if (updateInfo.modifiedCount === 0) throw "Could not delete route";
    } catch (error) {
        throw error;
    }

};

export default {
    createRoute,
    getRouteById,
    getAllRoutes,
    deleteRoute
};