import app from "./app";
import { createServer } from "http";
import { initSocket } from "./socket";
import { startSolanaStream } from "./services/solana.stream";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

initSocket(httpServer);

// 🚀 START REAL BLOCKCHAIN STREAM
startSolanaStream();

httpServer.listen(PORT, () => {
  console.log(`🚀 API + WebSocket running on ${PORT}`);
});