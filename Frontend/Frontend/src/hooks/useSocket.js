import { io } from "socket.io-client";

export const socket = io("http://localhost:8000", {
  autoConnect: false,   // 🚨 MUST be false
  reconnection: false   // optional but good for debugging
});