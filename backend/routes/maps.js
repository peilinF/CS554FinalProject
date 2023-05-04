import express from "express";
import { getRoute, saveRoute } from "../data/maps.js";
import logbookData from '../data/logbook.js';

const router = express.Router();

router.route("/:id").get(async (req, res) => {
  try {
    let id = req.params.id;
    const route = await getRoute(id);
    res.status(200).json(route);
  } catch (error) {
    res.status(error.status).json(error.message);
  }
});

router.route("/").post(async (req, res) => {
  try {
    let body = req.body;
    const id = body.id;
    const path = body.log_info;
    const log = await logbookData.createLog(id, path);
    res.status(200).json(log);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});



export default router;
