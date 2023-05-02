import { ObjectId } from "mongodb";
import { messages } from "../config/mongoCollections.js";

export const createMessage = async (ConversationId, UserId, Text) => {
    const messageCollection = await messages();
    let newMessage = {
        "ConversationId": ConversationId,
        "UserId": UserId,
        "Text": Text,
        "Time": new Date()
    };
    console.log(newMessage.Time)
    const newInsertInformation = await messageCollection.insertOne(newMessage);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed! (Message)';
    return newMessage;
};

export const getMessageByConversationId = async (ConversationId) => {
    const messageCollection = await messages();
    const messageOfConversation = await messageCollection.find({ "ConversationId": ConversationId }).toArray();
    console.log(messageOfConversation)
    if (messageOfConversation.length === 0) return [];
    return messageOfConversation
};

export const deleteMessagesByConversationId = async (ConversationId) => {
    const messageCollection = await messages();
    const messageOfConversation = await messageCollection.deleteMany({ "ConversationId": ConversationId });
    if (messageOfConversation.deletedCount === 0) return { error: `Could not delete any messages for conversation ${ConversationId}` };
    return true;
};
