"use client";

import React, { useState, useRef, useEffect } from "react";
import Auth from "@/service/user";
import { initSocket } from "@/service/socket";
import { useAuthStore } from "@/service/User-ts/AuthState";
import { useSocketStore } from "@/service/sockets/userSocketStore";
import Posts from "@/service/post";
import LinkeButton from "@/components/LikeButton/Likebutton";
import image_vavart_null from "@/public/image/avatuser_null.png";
import { FileText } from "lucide-react";
import PostContent from "@/components/LikeButton/Post-content"
import { useReactionStore } from "@/service/service-once/PostState";
import { usePostView } from "@/service/service-once/usePostView";
import Conversation from "@/components/Message/Conversation";

import PostSize from "@/components/Post/Post"

import { on } from "events";


interface FriendRequestData {
  fromUserId: string;
  fromPhone: string;
  message: string;
}


export interface User {
  id: number;
  username?: string;
  avatUrl?: string | null;
}
export interface ReactionResult {
  status: "added" | "removed" | "updated";
  reaction?: string;
}


export default function App() {

  const user = useAuthStore((state) => state.user);
  const socket = useSocketStore((s) => s.socket);
  //const [user, setUser] = useState<any>(null); // user hiện tại
  //const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  const [mes, setMes] = useState("");
  // 🔹 Lấy token & user info


  useEffect(() => {
    if (!socket) return;

    const onNewRequest = (data: FriendRequestData) => {
      alert(`Lời mời từ ${data.fromPhone}`);
      setMes(`📩 Bạn có lời mời kết bạn từ số ${data.fromPhone}`)
    }

    socket.on("newFriendRequest", onNewRequest);

    return () => {
      socket.off("newFriendRequest", onNewRequest);
    };
  }, [socket]);

  return (
    <div className="mt-28">
      <PostSize />
    </div>
  );
}
