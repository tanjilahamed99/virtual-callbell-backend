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
const port = process.env.PORT || 5000;


const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const userSockets = {}; // { username: socketId '}

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

app.get("/get-token", async (req, res) => {
  const { roomName, username } = req.query;

  // Create token
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: username }
  );

  // Add permissions
  at.addGrant({ roomJoin: true, room: roomName });

  // Wait for the token string
  const token = await at.toJwt();

  res.json({ token });
});

const userRoutes = require("./src/routes/auth/index.js");
const connectDB = require("./src/db/connectDB.js");

app.use("/v1/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the virtual callbell Call Backend");
});

const main = async () => {
  console.log("Called");
  await connectDB();

  httpServer.listen(port, () => {
    console.log("listening to port ", port);
  });
};

main();