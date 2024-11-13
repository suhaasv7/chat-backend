import { Server, Socket } from "socket.io";

import express, { Request, Response } from "express";
import { Server as HttpServer } from "http";
import { MessageData, Users } from "./type";

const app = express();
const server: HttpServer = app.listen(8000);
const io: Server = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});

app.get("/healthCheck", (req: Request, res: Response): void => {
  res.send("Server is running");
});

const users: Users = {};

io.on("connection", (socket: Socket): void => {
  socket.on("new-user-joined", (name: string): void => {
    if (name) {
      users[socket.id] = name;
      socket.broadcast.emit("user-joined", name);
    }
  });

  socket.on("send", (message: string): void => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    } as MessageData);
  });

  socket.on("disconnect", (): void => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
