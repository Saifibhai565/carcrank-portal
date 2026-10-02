// lib/socketServer.ts (WebSocket Manager)
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function initSocket(server: any) {
  if (!io) {
    io = new SocketIOServer(server, {
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log(`Admin/Client connected: ${socket.id}`);

      // Handle client clicks/events and forward to puppeteer
      socket.on("client-action", (data) => {
        // e.g., mouse click or typing coordinates
        console.log("Action received from client viewport:", data);
      });
    });
  }
  return io;
}