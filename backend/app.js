import express from "express";
import session from "express-session";
import Redis, {createClient} from "redis";
import RedisStore from "connect-redis";

import constructRoutes from "./routes/index.js";

import http from "http";

import cors from "cors";
import { Server as socketIo } from "socket.io";

import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema.js";

import admin from 'firebase-admin';

import serviceAccount from "./firebase/serviceAccountKey.js";
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(cors());
app.use(express.json());

// Redis configuration
let redisClient = createClient();
redisClient.connect().catch((err) => {
    console.log(err);
});

// session middleware
app.use(
    session({
        name: "AuthCookie",
        store: new RedisStore({ client: redisClient }),
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
    })
);

// logging middleware

let urTrack = {};
app.use((req, res, next) => {
    // count number of requests
    if (!urTrack[req.method + req.originalUrl]) {
        urTrack[req.method + req.originalUrl] = 0;
    }
    urTrack[req.method + req.originalUrl] += 1;

    // log requests
    let temp = req.body;
    if (!temp.password) {
        // console.log(
        //     req.method +
        //     " " +
        //     req.originalUrl +
        //     " " +
        //     urTrack[req.method + req.originalUrl] +
        //     " " +
        //     JSON.stringify(req.body)
        // );
    } else {
        // console.log(
        //     req.method +
        //     " " +
        //     req.originalUrl +
        //     " " +
        //     urTrack[req.method + req.originalUrl] +
        //     JSON.stringify(req.body.username)
        // );
    }
    console.log(req.originalUrl);
    next();
});

// verify user login

const verifyFirebaseToken = async (req, res, next) => {

    console.log('verifying token');

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;

        console.log("successfully verified token");

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).send('Unauthorized');
    }
};


app.use("/users/user-info", verifyFirebaseToken);

// Socket.io
// const io = new socketIo(server, {
//     cors: {
//         origin: "http://localhost:4000",
//         methods: ["GET", "POST"],
//     },
// });

// let onlineUsers = {};
// const userJoined = (userId, socketId) => {
//     onlineUsers[userId] = socketId;
// };
// const userDisconnected = (socketId) => {
//     if (onlineUsers.hasOwnProperty(socketId)) {
//         delete onlineUsers[socketId];
//     }
// };
// const checkIfUserOnline = (userId) => {
//     if (onlineUsers.hasOwnProperty(userId)) {
//         console.log(`${userId} is online`);
//         return onlineUsers[userId];
//     } else {
//         console.log(`${userId} is not online`);
//         return false;
//     }
// };
// io.on("connection", (socket) => {
//     console.log("A user connected.");
//     socket.on("userJoined", (userId) => {
//         userJoined(userId, socket.id);
//         io.emit("returnUser", onlineUsers);
//     });
//     socket.on("sendMessage", (messageData) => {
//         let userId = messageData.userId;
//         let friendId = messageData.friendId;
//         let text = messageData.text;
//         const user = checkIfUserOnline(friendId);
//         console.log("friendId", onlineUsers[friendId]);
//         io.to(user).emit("getMessage", {
//             userId,
//             text,
//         });
//     });
//     socket.on("disconnect", () => {
//         console.log("A user disconnected.");
//         userDisconnected(socket.id);
//         io.emit("returnUser", onlineUsers);
//     });
// });

// Socket.io

const server = http.createServer(app);

const io = new socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("New client connected. Id: ", socket.id);
    // console.log(socket);

    // Join a chatroom
    socket.on("join room", (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Leave the room if the user closes the socket
    socket.on("leave room", (roomId) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    // Listen for new messages
    socket.on("newMessage", (data) => {
        console.log("new message", data);
        io.in(data.roomId).emit("newMessage", data.info);
    });    

    socket.on("disconnect", () => {
        console.log("Client disconnected. Id: ", socket.id);
    });
});

// Apollo Server

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
});

const startServer = async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    constructRoutes(app);

    server.listen(5000, () => {
        console.log("Server started at http://localhost:5000/");
    });
}

startServer();
