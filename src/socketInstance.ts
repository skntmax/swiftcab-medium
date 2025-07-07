import { Socket } from "socket.io";

// Somewhere globally
export const socketMap = new Map<string, Socket>();