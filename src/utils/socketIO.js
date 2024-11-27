import { io } from "socket.io-client";
import { getEnvironmentURL } from "./getUrl";

let socket;

export const connectSocket = (uniqueId) => {
    const BASE_URL = getEnvironmentURL();

    socket = io(BASE_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
        console.log(`Conectado al servidor con ID: ${socket.id}`);
        socket.emit("register", uniqueId);
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log("Socket desconectado");
    }
};
