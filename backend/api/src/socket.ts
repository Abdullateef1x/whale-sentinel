import { Server } from "socket.io";

let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);
  });

  return io;
};

export const emitEvent = (event: string, data: any) => {
  if (!io) throw new Error("Socket not initialized");
  io.emit(event, data);
};

export const getIO = () => io;