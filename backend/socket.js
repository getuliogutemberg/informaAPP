const { Server } = require("socket.io");

const io = (server) => {
  const socketIo = new Server(server, { cors: { origin: "*" } });
  
  try {
    socketIo.on("connection", (socket) => {
      console.log("Usuário conectado:", socket.id);

      socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.id);
      });
    });
  } catch (err) {
    console.error("Erro ao inicializar o socket.io:", err);
  }

  return socketIo;
};

module.exports = io;
