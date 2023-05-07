import express from "express";
import {
  createConversation,
  getAllConversationsByUserId,
  getConversationOfTwoUsersId,
  deleteAllConversationsByUserId,
  deleteConversationOfTwoUsersId,
} from "../data/conversation.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
  try {
    console.log(req.body);
    const newConversation = await createConversation(
      req.body.senderId,
      req.body.receiverId
    );
    res.status(200).json(newConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.route("/:userId").get(async (req, res) => {
  try {
    const Conversation = await getAllConversationsByUserId(req.params.userId);
    res.status(200).json(Conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.route("/delete/:userId").get(async (req, res) => {
  try {
    const deleteConversation = await deleteAllConversationsByUserId(
      req.params.userId
    );
    res.status(200).json(deleteConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.route("/:firstUserId/:secondUserId").get(async (req, res) => {
  try {
    const Conversation = await getConversationOfTwoUsersId(
      req.params.firstUserId,
      req.params.secondUserId
    );
    res.status(200).json(Conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.route("/delete/:firstUserId/:secondUserId").get(async (req, res) => {
  try {
    const deleteConversation = await deleteConversationOfTwoUsersId(
      req.params.firstUserId,
      req.params.secondUserId
    );
    res.status(200).json(deleteConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
