import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/auth";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token = getAccessToken();
    socket = io(import.meta.env.VITE_API_WS_URL || "http://localhost:3000", {
      auth: { token },
      withCredentials: false,
    });
  }
  return socket;
}
