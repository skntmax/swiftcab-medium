import { Server, Socket } from "socket.io";
import http from "http";
import { app } from "../server";
import { env } from "../config/env";
import  jwt from "jsonwebtoken"; // make sure to install this
import { attachRedisAdapter } from "./redis/socketRedisAdapter";
import { CONSOLE_COLORS } from "../config/constant";
import Express from 'express';
type SocketHandler = (socket: Socket, data: any) => void;

const server = http.createServer(app);

class SocketServer {
  private io: Server;
  private customEventHandlers: Map<string, SocketHandler>;

  constructor() {
    this.io = new Server(server, {
      cors: {
        origin: "*", // you can replace this with specific origin for security
      },
    });

    this.customEventHandlers = new Map();
    this.attachRedisAdaptor()
    this.initializeSocketEvents();
    return this;
  }


  private async  attachRedisAdaptor  () {
    await attachRedisAdapter(this.io);
  }
   
  private initializeSocketEvents(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log(CONSOLE_COLORS.BgGreen, "[[ Client connected:", socket.id, "]]");

      // Built-in event
      socket.on("message", (data) => {
        console.log("Received message:", data);
        this.io.emit("message", data);
      });

      // Register all custom events with public/private check
      this.customEventHandlers.forEach((handler, eventName) => {
        socket.on(eventName, (data) => {
          const access = data?.access || "public";
          const token = socket.handshake.auth?.token || data?.token;


          if (access === "private") {
            if (!token || !this.verifyToken(token)) {
              console.warn(`Unauthorized private access on event "${eventName}" by`, socket.id);
              socket.emit("unauthorized", { event: eventName, reason: "Invalid or missing token" });
              return;
            }
          }

        if (access === "private") {
          let user = this.getUserInfo(token)
          if (user) {
            data.user = user  
            data.portal = socket.handshake.auth?.portal  
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

  private verifyToken(token: string): boolean {
    try {
      // Strip "Bearer " if provided
      const cleanToken = token.replace(/^Bearer\s/, "");
      console.log(cleanToken, env.SECRET_KEY)
      const decoded = jwt.verify(cleanToken, env.SECRET_KEY);
      return !!decoded;
    } catch (err: any) {
      console.error("Token verification failed:", err.message);
      return false;
    }
  }

   private getUserInfo(token: string): any {
    try {
      // Strip "Bearer " if provided
      const cleanToken = token.replace(/^Bearer\s/, "");
      const decoded = jwt.verify(cleanToken, env.SECRET_KEY);
      return decoded;
    } catch (err: any) {
      console.error("Token verification failed:", err.message);
      return false;
    }
  }

  // Register custom events to apply on new connections
  public on(eventName: string, handler: SocketHandler): void {
    this.customEventHandlers.set(eventName, handler);
  }

  public getIO(): Server {
    return this.io;
  }

  public start(port: number): void {
    server.listen(port, () => {
      console.log(CONSOLE_COLORS.BgBlue, `[[ swiftcab-medium Server listening on http://localhost:${port} ]]`);
    });
  }
}

export default SocketServer;
