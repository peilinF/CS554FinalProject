import express from "express";
import {
  acceptRequest,
  addRequest,
  getAllPeople,
  getRequests,
  myFriends,
  removeFriend,
  declineRequest,
} from "../data/friends.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await getAllPeople(req.headers.authorization));
  } catch (error) {
    res.status(404).json(error);
  }
});

router.get("/requests", async (req, res) => {
  try {
    res.status(200).json(await getRequests(req.headers.authorization));
  } catch (error) {
    res.status(404).json(error);
  }
});

router.get("/friends", async (req, res) => {
  try {
    res.status(200).json(await myFriends(req.headers.authorization));
  } catch (error) {
    res.status(404).json(error);
  }
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

router.post("/declineRequest", async (req, res) => {
  try {
    let targetId = req.body.targetId;
    let uid = req.body.uid;
    const res = await declineRequest(targetId, uid);
    res.status(200);
  } catch (error) {
    res.json(error);
  }
});

router.post("/accept", async (req, res) => {
  try {
    let targetId = req.body.targetId;
    let uid = req.body.uid;
    const res = await acceptRequest(targetId, uid);
    res.status(200);
  } catch (error) {
    res.json(error);
  }
});

router.post("/removeFriend", async (req, res) => {
  try {
    let targetId = req.body.targetId;
    let uid = req.body.uid;
    const res = await removeFriend(targetId, uid);
    res.status(200);
  } catch (error) {
    res.json(error);
  }
});
export default router;
