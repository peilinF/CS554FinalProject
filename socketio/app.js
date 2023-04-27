//https://makeschool.org/mediabook/oa/tutorials/make-chat/saving-and-destroying-users/
//looked at ideas from this web (ideas that I looked userJoined, userDisconnected)
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
const checkUserIfOnline = (userId) => {
    return Object.values(onlineUsers).find((user) => user.userId === userId);
}
io.on("connection", (socket) => {
    console.log("A user connected.");
    socket.on("userJoined", userId => {
        userJoined(userId, socket.id);
        socket.emit("returnUser", onlineUsers)
    })
    socket.on("sendMessage", (userId, friendID, text) => {
        const user = checkUserIfOnline(friendID);
        console.log(userId, friendID, text)
        socket.to(user.socketId).emit("getMessage", {
            userId,
            text
        })
    })
    socket.on("disconnect", () => {
        console.log("A user disconnected.")
        userDisconnected(socket.id)
        socket.emit("returnUser", onlineUsers)
    });
});