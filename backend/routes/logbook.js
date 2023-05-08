import express from "express";
import { getUserById } from "../data/users.js";

import routesData from "../data/routes.js";
import logbookData from "../data/logbook.js";

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

    res
      .status(200)
      .json({ message: "Route saved successfully", route: route_db });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/get-all-routes", async (req, res) => {
  const userId = req.query.userId;

  try {
    const user_db = await getUserById(userId);
    if (!user_db) throw "User not found";

    const routes_db = await routesData.getAllRoutes(userId);
    res
      .status(200)
      .json({ message: "Routes found successfully", routes: routes_db });
  } catch (error) {
    res.status(500).json({ error: error });
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
    res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/get-logbook", async (req, res) => {
  const userId = req.query.userId;

  try {
    const user_db = await getUserById(userId);
    if (!user_db) throw "User not found";

    const logbook_db = await logbookData.getAllLogs(userId);
    res
      .status(200)
      .json({ message: "Logbook found successfully", logbook: logbook_db });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/create-log", async (req, res) => {
  const userId = req.query.userId;
  const log_info = req.query.log_info;

  try {
    const user_db = await getUserById(userId);
    if (!user_db) throw "User not found";
  } catch (error) {
    throw error;
  }

  let route_db = null;
  try {
    route_db = await routesData.getRouteById(userId, log_info.routeId);
    if (!route_db) throw "Route not found";
  } catch (error) {
    throw error;
  }

  log_info.routeInfo = route_db;

  try {
    const log_db = await logbookData.createLog(userId, log_info);
    res.status(200).json({ message: "Log created successfully", log: log_db });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/edit-log", async (req, res) => {
  const userId = req.query.userId;
  const logId = req.query.logId;
  const log_info = req.query.log_info;

  console.log(userId);
  console.log(logId);

  try {
    const user_db = await getUserById(userId);
    if (!user_db) throw "User not found";
  } catch (error) {
    throw error;
  }

  let log_db = null;
  try {
    log_db = await logbookData.getLogById(userId, logId);
    console.log("get new log", log_db);
    if (!log_db) throw "Log not found";
  } catch (error) {
    throw error;
  }

  console.log("successfullly got log");

  let route_db = null;
  try {
    route_db = await routesData.getRouteById(userId, log_info.routeId);
    if (!route_db) throw "Route not found";
  } catch (error) {
    throw error;
  }

  log_info.routeInfo = route_db;

  console.log("try to edit log");

  try {
    log_db = await logbookData.updateLog(userId, logId, log_info);
    res.status(200).json({ message: "Log edited successfully", log: log_db });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/delete-log", async (req, res) => {
  const userId = req.query.userId;
  const logId = req.query.logId;

  try {
    const user_db = await getUserById(userId);
    if (!user_db) throw "User not found";

    const log_db = await logbookData.getLogById(userId, logId);
    if (!log_db) throw "Log not found";
  } catch (error) {
    console.log(error);
    throw error;
  }

  try {
    await logbookData.deleteLog(userId, logId);
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
