import express from "express";
import {
  addRequest,
  getAllPeople,
  getRequests,
  myFriends,
} from "../data/friends.js";

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

router.post("/", async (req, res) => {
  try {
    let targetId = req.body.targetId;
    let uid = req.body.uid;
    const res = await addRequest(targetId, uid);
    res.status(200);
  } catch (error) {
    res.json(error);
  }
});
export default router;
