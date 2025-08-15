const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");
const express = require("express");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const userSockets = {}; // { username: socketId }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (username) => {
    userSockets[username] = socket.id;
    io.emit("users", Object.keys(userSockets)); // send list to all
  });

  socket.on("call-user", ({ from, to, roomName }) => {
    const targetSocket = userSockets[to];
    if (targetSocket) {
      io.to(targetSocket).emit("incoming-call", { from, roomName });
    }
  });

  socket.on("disconnect", () => {
    for (const [name, id] of Object.entries(userSockets)) {
      if (id === socket.id) {
        delete userSockets[name];
        break;
      }
    }
    io.emit("users", Object.keys(userSockets));
  });
});

// API route to generate LiveKit token
app.get("/get-token", (req, res) => {
  const { roomName, username } = req.query;

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: username }
  );

  at.addGrant({ roomJoin: true, room: roomName });

  res.json({ token: at.toJwt() });
});

app.get("/", (req, res) => {
  res.send("Welcome to the virtual callbell Call Backend");
});

httpServer.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
