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

const userSockets = []; // Move outside, so it's shared across all connections

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // Registered user joins
  socket.on("register", (userId) => {
    userSockets.push({ id: userId, socketId: socket.id });
    io.emit(
      "users",
      userSockets.map(({ socketId, ...rest }) => rest)
    );
  });

  // Guest calls directly
  socket.on("guest-call", ({ from, to, roomName }) => {
    const target = userSockets.find((entry) => entry.id === "68a079f6bbe84b8f120dff89");
    console.log(target)
    if (target) {
      io.to(target.socketId).emit("incoming-call", {
        from: { name: from, guest: true },
        roomName,
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const index = userSockets.findIndex(
      (entry) => entry.socketId === socket.id
    );
    if (index !== -1) userSockets.splice(index, 1);

    io.emit(
      "users",
      userSockets.map(({ socketId, ...rest }) => rest)
    );
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
