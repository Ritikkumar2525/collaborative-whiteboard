const registerDrawingSocket = (io, socket) => {

    socket.on("draw", (data) => {
      socket.to(data.roomId).emit("draw", data);
    });
  
  };
  
  export default registerDrawingSocket;