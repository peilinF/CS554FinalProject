import { conversations } from "../config/mongoCollections.js";

export const createConversation = async (UserId, FriendId) => {
    const conversationCollection = await conversations();
    const conversation = await conversationCollection.findOne({ $or: [{ members: [UserId, FriendId] }, { members: [FriendId, UserId] }] })
    if (conversation !== null) throw 'Conversation already exists';
    let newConversation = {
        members: [UserId, FriendId],
        showConversation: true
    };
    const newInsertInformation = await conversationCollection.insertOne(newConversation);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed! (Conversation)';
    return newConversation;
};

export const getAllConversationsByUserId = async (UserId) => {
    const conversationCollection = await conversations();
    const conversationsOfUser = await conversationCollection.find({
        members: UserId,
        showConversation: true
    }).toArray();
    console.log(conversationsOfUser)
    if (conversationsOfUser.length === 0) return [];
    return conversationsOfUser
};

export const deleteAllConversationsByUserId = async (UserId) => {
    const conversationCollection = await conversations();
    const deletionConversation = await conversationCollection.deleteMany({ members: UserId });
    if (deletionConversation.deletedCount === 0) throw `Could not delete any conversations for user ${UserId}`;
    return true;
};

export const getConversationOfTwoUsersId = async (UserId, FriendId) => {
    const conversationCollection = await conversations();
    const conversation = await conversationCollection.findOne({ $or: [{ members: [UserId, FriendId] }, { members: [FriendId, UserId] }] });
    console.log(conversation)
    if (conversation === null) throw 'Conversations doesnts exists';
    return conversation;
};

export const deleteConversationOfTwoUsersId = async (UserId, FriendId) => {
    const conversationCollection = await conversations();
    const deletionConversation = await conversationCollection.deleteOne({ $or: [{ members: [UserId, FriendId] }, { members: [FriendId, UserId] }] });
    if (deletionConversation.deletedCount === 0) throw `Could not delete any conversations for user ${UserId}`;
    return true;
};