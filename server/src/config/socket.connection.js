import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "../../../../shared/middlewares/auth.middleware.js";
import { PUBLICATION_ENV } from "../constants/publication.constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

class SocketManager {
  constructor() {
    this.io = null;
    this.initialized = false;
    this.roomPrefix = PUBLICATION_ENV.socketRoomPrefix;
  }

  initialize(httpServer) {
    if (this.initialized) {
      return this.io;
    }

    const originsEnv = process.env.SOCKET_ALLOWED_ORIGINS;
    if (!originsEnv) {
      throw new Error(
        "SOCKET_ALLOWED_ORIGINS environment variable is required"
      );
    }

    const allowedOrigins = originsEnv
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    this.io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token) {
          return next(new Error("Authentication token is required"));
        }

        const decoded = verifyToken(token);
        const inferredUserId = decoded?.userId || decoded?.id || decoded?._id;
        if (!decoded || !inferredUserId) {
          return next(new Error("Invalid or expired authentication token"));
        }

        socket.data.userId = inferredUserId;
        next();
      } catch (error) {
        next(error);
      }
    });

    this.io.on("connection", (socket) => {
      const userId = socket.data.userId;
      if (userId) {
        const room = this.#buildRoomName(userId);
        socket.join(room);
      }

      socket.on("disconnect", () => {
        // Rooms are automatically cleaned up by socket.io
      });
    });

    this.initialized = true;
    return this.io;
  }

  emitToUser(userId, event, payload) {
    if (!this.io) {
      throw new Error("Socket server is not initialized");
    }
    if (!userId) {
      return;
    }
    const room = this.#buildRoomName(userId);
    this.io.to(room).emit(event, payload);
  }

  #buildRoomName(userId) {
    return `${this.roomPrefix}:${userId}`;
  }
}

const socketManager = new SocketManager();
export default socketManager;
