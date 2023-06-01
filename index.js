const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
// const __dirname1 = path.resolve();
const socket = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require('cors');
app.use(cors({
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}));

const port = process.env.PORT || 8000;
// require("./")
app.use("/images", express.static('images'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("./DB/connection");
app.use(require("./router/router"));
dotenv.config()
app.use(cookieParser());

const server = app.listen(port, () => {
    console.log("connected to port 8000");
})

const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        const set = onlineUsers.set(userId, socket.id);
        console.log(set);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        console.log(sendUserSocket);
        if (sendUserSocket) {
            console.log(data.to);
            io.to(sendUserSocket).emit("recieve", data.message);
            // io.emit("recieve",data.message);
        }
    });
});
// let users = [];
// const addUser = (userId, socketId) => {
//     !users.some((user) => user.userId === userId) &&
//         users.push({ userId, socketId });
// };
// const removeUser = (socketId) => {
//     users = users.filter((user) => user.socketId !== socketId);
// };
// const getUser = (userId) => {
//     return users.find((user) => user.userId === userId);
// };
// io.on("connection", (socket) => {
//     //when ceonnect
//     console.log("a user connected.");
//     //take userId and socketId from user
//     socket.on("add-user", (userId) => {
//         addUser(userId, socket.id);
//         io.emit("getUsers", users);
//         console.log("yes");
//     });
//     socket.on("send-msg", (data) => {
//         console.log(data);
//         const user = getUser(data.to);
//         io.to(user.socketId).emit("recieve", data.message);
//     });

//     //when disconnect
//     socket.on("disconnect", () => {
//         console.log("a user disconnected!");
//         removeUser(socket.id);
//         // io.emit("getUsers", users);
//     });
// });