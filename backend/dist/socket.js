"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const initializeSocket = (server) => {
    const socketIo = new socket_io_1.Server(server, {
        cors: {
            origin: "*"
        }
    });
    try {
        socketIo.on("connection", (socket) => {
            console.log("Usuário conectado:", socket.id);
            socket.on("disconnect", () => {
                console.log("Usuário desconectado:", socket.id);
            });
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Erro ao inicializar o socket.io:", err.message);
        }
        else {
            console.error("Erro desconhecido ao inicializar o socket.io");
        }
    }
    return socketIo;
};
exports.default = initializeSocket;
