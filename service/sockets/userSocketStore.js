import { create } from "zustand";
import { initSocket } from "../socket";

export const useSocketStore = create((set, get) => ({
    socket: null,

    init: (userId) => {
        if (get().socket) return;
    
        const socket = initSocket();
    
        socket.on("connect", () => {
          socket.emit("register", String(userId));
          console.log("🟢 Socket connected");
        });
    
        set({ socket });
      },
    
      disconnect: () => {
        get().socket?.disconnect();
        set({ socket: null });
      }
}));