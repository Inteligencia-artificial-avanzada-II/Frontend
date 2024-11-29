// Importaciones necesarias
// - io: Biblioteca para conectar el cliente con un servidor Socket.IO.
// - getEnvironmentURL: Función que devuelve la URL base dependiendo del entorno.
import { io } from "socket.io-client";
import { getEnvironmentURL } from "./getUrl";

// Variable para almacenar la instancia del socket.
let socket;

// Función para conectar el socket al servidor
// - uniqueId: Identificador único del cliente que se registrará en el servidor.
export const connectSocket = (uniqueId) => {
    // Obtiene la URL base del entorno actual.
    const BASE_URL = getEnvironmentURL();

    // Establece la conexión al servidor Socket.IO con opciones de reconexión.
    socket = io(BASE_URL, {
        reconnection: true, // Habilita la reconexión automática.
        reconnectionAttempts: 5, // Intenta reconectar hasta 5 veces.
        reconnectionDelay: 2000, // Tiempo entre intentos de reconexión (en milisegundos).
    });

    // Evento que se dispara cuando el cliente se conecta exitosamente al servidor.
    socket.on("connect", () => {
        socket.emit("register", uniqueId); // Emite un evento personalizado al servidor para registrar al cliente con su uniqueId.
    });

    // Retorna la instancia del socket para uso adicional.
    return socket;
};

// Función para obtener la instancia actual del socket.
export const getSocket = () => socket;

// Función para desconectar el socket del servidor.
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect(); // Cierra la conexión del socket.
        console.log("Socket desconectado"); // Confirma que el socket fue desconectado.
    }
};
