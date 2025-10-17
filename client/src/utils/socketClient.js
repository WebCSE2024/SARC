import { io } from "socket.io-client";
import { getEnv } from "../../../../shared/axios/axiosInstance";

let socketInstance = null;

const resolveBaseUrl = () => {
  const base = getEnv("VITE_APP_SARC_SERVICE_URI", "http://localhost:5005/");
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

export const getSocket = (token) => {
  if (!token) {
    return null;
  }

  const baseUrl = resolveBaseUrl();

  if (!socketInstance) {
    socketInstance = io(baseUrl, {
      transports: ["websocket"],
      auth: { token },
      autoConnect: true,
    });
    return socketInstance;
  }

  if (socketInstance.disconnected) {
    socketInstance.auth = { token };
    socketInstance.connect();
  }

  return socketInstance;
};

export const closeSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
