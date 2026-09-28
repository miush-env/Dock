import { Server as SocketIOServer } from "socket.io";

export function initSocket(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Nuevo socket conectado:", socket.id);
    socket.on("message", (data) => {
      console.log("Mensaje recibido:", data);

    });
    socket.on("joinRoom", (roomId) => {
      console.log("Un socket se unió a la sala:", roomId);
      socket.join(roomId)
    })
    socket.on("leaveRoom", (roomId) => {
      console.log("Un socket se salió de la sala:", roomId);
      socket.leave(roomId)
    })
  });

  return io;
}
