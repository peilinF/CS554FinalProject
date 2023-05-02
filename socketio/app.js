//https://makeschool.org/mediabook/oa/tutorials/make-chat/saving-and-destroying-users/
//looked at ideas from this web (ideas that I looked userJoined, userDisconnected)
//https://github.com/safak/youtube/blob/chat-app/socket/index.js
//looked how to "sendMessage"
const io = require("socket.io")(4000, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
let onlineUsers = {}
const userJoined = (userId, socketId) => {
    onlineUsers[userId] = socketId;
}
const userDisconnected = (socketId) => {
    if (onlineUsers.hasOwnProperty(socketId)) {
        delete onlineUsers[socketId];
    }
}
const checkIfUserOnline = (userId) => {
    if (onlineUsers.hasOwnProperty(userId)) {
        console.log(`${userId} is online`);
        return onlineUsers[userId]
    } else {
        console.log(`${userId} is not online`);
        return false
    }
}
io.on("connection", (socket) => {
    console.log("A user connected.");
    socket.on("userJoined", userId => {
        userJoined(userId, socket.id);
        io.emit("returnUser", onlineUsers)
    })
    socket.on("sendMessage", (messageData) => {
        let userId = messageData.userId
        let friendId = messageData.friendId
        let text = messageData.text
        const user = checkIfUserOnline(friendId);
        console.log("friendId", onlineUsers[friendId])
        io.to(user).emit("getMessage", {
            userId,
            text
        })
    })
    socket.on("disconnect", () => {
        console.log("A user disconnected.")
        userDisconnected(socket.id)
        io.emit("returnUser", onlineUsers)
    });
});
