"use client";

import { useEffect } from "react";
import { useAuthStore} from "@/service/service-once/AuthState";
import { useSocketStore } from "@/service/sockets/userSocketStore";

export default function InitSocket() {
    const user = useAuthStore((s) => s.user);
    const socket = useSocketStore((s) => s.init);

    useEffect(() => {
        if (user?.id) {
            socket(user.id);
        }
    }, [user?.id]);

    return null;
}