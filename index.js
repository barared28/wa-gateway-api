const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.send('hello');
})

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

server.listen(process.env.PORT || 5000, () => {
    console.log("SERVER RUNNING ON 3001");
});