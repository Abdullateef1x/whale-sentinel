import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);
});

httpServer.listen(PORT, () => {
  console.log(`🚀 API + WebSocket running on ${PORT}`);
});