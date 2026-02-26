const rooms = {};

const registerPresenceSocket = (io, socket) => {

  socket.on("join-room", ({ roomId }) => {
    const user = socket.user; // from socket auth middleware

    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Prevent duplicate join
    const alreadyExists = rooms[roomId].find(
      (u) => u.id === socket.id
    );

    if (!alreadyExists) {
      rooms[roomId].push({
        id: socket.id,
        name: user.name,
        online: true,
      });
    }

    io.to(roomId).emit("participants-update", rooms[roomId]);
  });

  socket.on("disconnecting", () => {
    for (const roomId of socket.rooms) {
      if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter(
          (u) => u.id !== socket.id
        );

        io.to(roomId).emit("participants-update", rooms[roomId]);
      }
    }
  });
};

export default registerPresenceSocket;