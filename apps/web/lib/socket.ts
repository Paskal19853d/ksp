import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

let socket: Socket | null = null;

// Single shared connection for the whole app — components never call io()
// themselves, they go through getSocket()/useSocket() so there's exactly one
// WebSocket per browser tab regardless of how many components join rooms.
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
}
