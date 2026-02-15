// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.SOCKET_URL || "http://localhost:3000"; //  apna backend port dalna

export const socket = io(SOCKET_URL, {
  withCredentials: true,
    transports: ["websocket"],
});
