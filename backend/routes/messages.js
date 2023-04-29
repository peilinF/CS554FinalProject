import express from "express";
import { createMessage, getMessageByConversationId, deleteMessagesByConversationId } from "../data/messages.js"

const router = express.Router();

router
    .route('/')
    .post(async (req, res) => {
        try {
            const newMessage = await createMessage(req.body.conversationId, req.body.userId, req.body.text)
            res.status(200).json(newMessage);
        } catch (err) {
            res.status(500).json(err);
        }
    })
router
    .route('/:conversationId')
    .get(async (req, res) => {
        try {
            const Message = await getMessageByConversationId(req.params.conversationId)
            res.status(200).json(Message);
        } catch (err) {
            res.status(500).json(err);
        }
    })
router
    .route('/delete/:conversationId')
    .get(async (req, res) => {
        try {
            const deleteMessage = await deleteMessagesByConversationId(req.params.conversationId)
            res.status(200).json(deleteMessage);
        } catch (err) {
            res.status(500).json(err);
        }
    })
router

export default router;