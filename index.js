const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

// config socket io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://wa-gateway-client.vercel.app"
    }
});

// handlers import
const userHandler = require("./src/handlers/user");
const messageHandler = require("./src/handlers/message");

io.on("connection", (socket) => {
    userHandler(io, socket);
    messageHandler(io, socket);
});

server.listen(3001, () => {
    console.log("SERVER RUNNING");
});