import registerPresenceSocket from "./presence.socket.js";
import registerChatSocket from "./chat.socket.js";

const initializeSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    registerPresenceSocket(io, socket);
    registerChatSocket(io, socket); // 🔥 ADD THIS

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

export default initializeSockets;