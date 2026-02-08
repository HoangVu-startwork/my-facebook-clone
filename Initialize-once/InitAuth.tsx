"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/service/service-once/AuthState";

export default function InitAuth() {
    const fetchUser = useAuthStore((state) => state.fetchUser);
    useEffect(() => {
      fetchUser(); // 🔥 chạy đúng 1 lần khi app load
    }, []);
  
    return null;
}