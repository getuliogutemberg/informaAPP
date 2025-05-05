import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

const initializeSocket = (server: HttpServer): Server => {
  const socketIo = new Server(server, { 
    cors: { 
      origin: "*" 
    } 
  });
  
  try {
    socketIo.on("connection", (socket: Socket) => {
      console.log("Usuário conectado:", socket.id);

      socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.id);
      });
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Erro ao inicializar o socket.io:", err.message);
    } else {
      console.error("Erro desconhecido ao inicializar o socket.io");
    }
  }

  return socketIo;
};

export default initializeSocket;