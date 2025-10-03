const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let rooms = {};

io.on("connection", (socket) => {
  socket.on("createRoom", (roomId) => {
    rooms[roomId] = { players: [] };
    socket.join(roomId);
    rooms[roomId].players.push(socket.id);
    io.to(roomId).emit("roomUpdate", rooms[roomId]);
  });

  socket.on("joinRoom", (roomId) => {
    if (rooms[roomId]) {
      socket.join(roomId);
      rooms[roomId].players.push(socket.id);
      io.to(roomId).emit("roomUpdate", rooms[roomId]);
    }
  });

  socket.on("message", ({ roomId, message }) => {
    io.to(roomId).emit("message", { sender: socket.id, message });
  });

  socket.on("rate", ({ roomId, targetId, score }) => {
    io.to(roomId).emit("rated", { from: socket.id, to: targetId, score });
  });

  socket.on("disconnect", () => {
    for (let roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);
      io.to(roomId).emit("roomUpdate", rooms[roomId]);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on port", PORT));
