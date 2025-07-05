"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const server_1 = require("../server");
const env_1 = require("../config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // make sure to install this
const server = http_1.default.createServer(server_1.app);
class SocketServer {
    constructor() {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*", // you can replace this with specific origin for security
            },
        });
        this.customEventHandlers = new Map();
        this.initializeSocketEvents();
        return this;
    }
    initializeSocketEvents() {
        this.io.on("connection", (socket) => {
            console.log("✅ Client connected:", socket.id);
            // Built-in event
            socket.on("message", (data) => {
                console.log("Received message:", data);
                this.io.emit("message", data);
            });
            // Register all custom events with public/private check
            this.customEventHandlers.forEach((handler, eventName) => {
                socket.on(eventName, (data) => {
                    var _a, _b;
                    const access = (data === null || data === void 0 ? void 0 : data.access) || "public";
                    const token = ((_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) || (data === null || data === void 0 ? void 0 : data.token);
                    if (access === "private") {
                        if (!token || !this.verifyToken(token)) {
                            console.warn(`Unauthorized private access on event "${eventName}" by`, socket.id);
                            socket.emit("unauthorized", { event: eventName, reason: "Invalid or missing token" });
                            return;
                        }
                    }
                    if (access === "private") {
                        let user = this.getUserInfo(token);
                        if (user) {
                            data.user = user;
                            data.portal = (_b = socket.handshake.auth) === null || _b === void 0 ? void 0 : _b.portal;
                            handler(socket, data);
                        }
                    }
                    handler(socket, data);
                });
            });
            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });
    }
    verifyToken(token) {
        try {
            // Strip "Bearer " if provided
            const cleanToken = token.replace(/^Bearer\s/, "");
            console.log(cleanToken, env_1.env.SECRET_KEY);
            const decoded = jsonwebtoken_1.default.verify(cleanToken, env_1.env.SECRET_KEY);
            return !!decoded;
        }
        catch (err) {
            console.error("Token verification failed:", err.message);
            return false;
        }
    }
    getUserInfo(token) {
        try {
            // Strip "Bearer " if provided
            const cleanToken = token.replace(/^Bearer\s/, "");
            const decoded = jsonwebtoken_1.default.verify(cleanToken, env_1.env.SECRET_KEY);
            return decoded;
        }
        catch (err) {
            console.error("Token verification failed:", err.message);
            return false;
        }
    }
    // Register custom events to apply on new connections
    on(eventName, handler) {
        this.customEventHandlers.set(eventName, handler);
    }
    getIO() {
        return this.io;
    }
    start(port) {
        server.listen(port, () => {
            console.log(`🚀 Server listening on http://localhost:${port}`);
        });
    }
}
exports.default = SocketServer;
