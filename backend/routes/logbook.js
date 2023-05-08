import express from "express";
import { getUserById } from "../data/users.js";

import routesData from "../data/routes.js";
import logbookData from "../data/logbook.js";

import { v4 as uuid } from "uuid";
import utils from "../utils.js";

const router = express.Router();

router.post("/save-route", async (req, res) => {

    const userId = req.body.userId;
    const directions = req.body.directions;

    try {
        const user_db = await getUserById(userId);
        if (!user_db) throw "User not found";
    } catch (error) {
        throw error;
    }

    try {
        const route_db = await routesData.createRoute(userId, directions);

        res.status(200).json({message: "Route saved successfully", route: route_db});
    } catch (error) {
        res.status(500).json({error: error});
    }

});

router.get("/get-all-routes", async (req, res) => {

    const userId = req.query.userId;


    try {
        const user_db = await getUserById(userId);
        if (!user_db) throw "User not found";

        const routes_db = await routesData.getAllRoutes(userId);
        res.status(200).json({message: "Routes found successfully", routes: routes_db});
    } catch (error) {
        res.status(500).json({error: error});
    }

});

router.get("/delete-route", async (req, res) => {

    const userId = req.query.userId;
    const routeId = req.query.routeId;

    console.log("deleting route");

    try {
        const user_db = await getUserById(userId);
        if (!user_db) throw "User not found";

        const route_db = await routesData.getRouteById(userId, routeId);
        if (!route_db) throw "Route not found";
    } catch (error) {
        throw error;
    }

    console.log("deleting route");

    try {
        await routesData.deleteRoute(userId, routeId);
        res.status(200).json({message: "Route deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error});
    }

});

export default router;