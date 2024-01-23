//node server which will handle socket io connections
const express = require("express");
var app = express();
var server = app.listen(8000);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//creating a healthCheck path to check if the server is running
app.get("/healthCheck", (req, res) => {
  res.send("Server is running");
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    if (name) {
      users[socket.id] = name;
      socket.broadcast.emit("user-joined", name);
    }
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
