import express from "express";
import { getRoute, saveRoute } from "../data/maps.js";

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
    const route = await saveRoute(body);
    res.status(200).json(route);
  } catch (error) {
    res.status(error.status).json(error.message);
  }
});

export default router;
