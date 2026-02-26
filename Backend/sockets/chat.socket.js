import Message from "../models/Message.model.js";
import Whiteboard from "../models/Whiteboard.model.js";

const registerChatSocket = (io, socket) => {

  /* ===============================
     JOIN ROOM
  =============================== */
  socket.on("join-chat-room", async (roomId) => {
    try {
      socket.join(roomId);

      /* -------- Load Messages -------- */
      const messages = await Message.find({ roomId })
        .sort({ createdAt: 1 })
        .limit(200);

      socket.emit("load-messages", messages);

      /* -------- Load or Create Whiteboard -------- */
      let board = await Whiteboard.findOne({ roomId });

      if (!board) {
        board = await Whiteboard.create({
          roomId,
          strokes: [],
        });
      }

      socket.emit("load-whiteboard", {
        objects: board.objects,
      });

      socket.to(roomId).emit("user-online", socket.user.name);

    } catch (err) {
      console.error("Join error:", err.message);
    }
  });

  /* ===============================
     DRAW (INFINITE CANVAS)
  =============================== */
  socket.on("draw", async ({ roomId, object }) => {
    try {
      if (!roomId || !object) return;
  
      let board = await Whiteboard.findOne({ roomId });
  
      if (!board) {
        board = await Whiteboard.create({
          roomId,
          objects: [],
        });
      }
  
      // Save object
      board.objects.push(object);
      await board.save();
  
      // Broadcast to others
      socket.to(roomId).emit("draw", { object });
  
    } catch (error) {
      console.error("Draw error:", error.message);
    }
  });

  /* ===============================
     CLEAR BOARD (FULL CLEAR)
  =============================== */
  socket.on("clear-board", async ({ roomId }) => {
    try {
      if (!roomId) return;
  
      const board = await Whiteboard.findOne({ roomId });
      if (!board) return;
  
      board.objects = [];
      await board.save();
  
      io.to(roomId).emit("clear-board");
  
    } catch (error) {
      console.error("Clear board error:", error.message);
    }
  });

  /* ===============================
     SEND MESSAGE
  =============================== */
  socket.on("send-message", async ({ roomId, message, file }) => {
    try {
      if (!message?.trim() && !file) return;

      const newMessage = await Message.create({
        roomId,
        sender: socket.user.name,
        message: message || "",
        file: file || null,
      });

      io.to(roomId).emit("receive-message", newMessage);

    } catch (error) {
      console.error("Send message error:", error.message);
    }
  });

  /* ===============================
     DELETE MESSAGE
  =============================== */
  socket.on("delete-message", async ({ messageId, roomId }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      if (message.sender !== socket.user.name) {
        console.log("Unauthorized delete attempt");
        return;
      }

      await Message.findByIdAndDelete(messageId);

      io.to(roomId).emit("message-deleted", messageId);

    } catch (error) {
      console.error("Delete message error:", error.message);
    }
  });

  /* ===============================
     TYPING
  =============================== */
  socket.on("typing", ({ roomId }) => {
    socket.to(roomId).emit("user-typing", socket.user.name);
  });

  socket.on("stop-typing", ({ roomId }) => {
    socket.to(roomId).emit("user-stop-typing");
  });

  /* ===============================
     DISCONNECT
  =============================== */
  socket.on("disconnect", () => {
    if (socket.user?.name) {
      io.emit("user-offline", socket.user.name);
    }
  });
};

export default registerChatSocket;