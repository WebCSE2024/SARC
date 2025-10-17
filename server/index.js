import http from "http";
import dotenv from "dotenv";
import { dbConnection } from "./src/connections/dbConnection.js";
import { app } from "./app.js";
import { redis } from "./src/connections/redisConnection.js";
import { initializeServices } from "./src/connections/rabbitmq.connnection.js";
import socketManager from "./src/connections/socket.connection.js";
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8001;

//MCP: For production the relative path to server the static file is : ../client/dist/index.html

dbConnection()
  .then(() => {
    return new Promise((resolve, reject) => {
      redis.ping((err, result) => {
        if (err) {
          console.error("Redis Connection Error:", err);
          reject(err);
        } else {
          console.log("Redis Ping Response:", result);
          resolve();
        }
      });
    });
  })
  .then(() => {
    return initializeServices();
  })
  .then(() => {
    const server = http.createServer(app);
    socketManager.initialize(server);
    server.listen(PORT, () => {
      console.log(`SERVER STARTED AT PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("SERVER STARTUP ERROR:", error);
  });
