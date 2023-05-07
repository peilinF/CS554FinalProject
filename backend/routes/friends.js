import express from "express";
import { getAllPeople, getRequests, myFriends } from "../data/friends.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json(await getAllPeople());
});

router.get("/requests/:id", async (req, res) => {
  res.status(200).json(await getRequests(req.params.id));
});

router.get("/friends/:id", async (req, res) => {
  res.status(200).json(await myFriends(req.params.id));
});
export default router;
