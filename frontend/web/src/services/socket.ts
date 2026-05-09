import { io } from "socket.io-client";

export const socket = io("http://localhost:5000");

// LIVE SIGNALS
socket.on("new-signal", (data) => {
  console.log("NEW SIGNAL:", data);
});

// REPLAY SIGNALS (ADD HERE)
socket.on("replay-signal", (data) => {
  console.log("REPLAY EVENT:", data);
});