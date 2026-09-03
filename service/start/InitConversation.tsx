"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/service/User-ts/AuthState";
import { useSocketStore } from "@/service/sockets/userSocketStore";
import { useConversationStore } from "@/components/Message/conversationStoreNew";

export default function InitMessaging() {
    const user = useAuthStore((s) => s.user);

    const socket = useSocketStore((s) => s.socket);
    const initSocket = useSocketStore((s) => s.init);

    const fetchConversations = useConversationStore(
        (s) => s.fetchConversations
    );

    const updateConversation = useConversationStore(
        (s) => s.updateConversation
    );

    const addConversation = useConversationStore(
        (s) => s.addConversation
    );

    // =========================
    // 1. Khởi tạo Socket
    // =========================

    useEffect(() => {
        if (!user?.id) return;

        initSocket(user.id);
    }, [user?.id, initSocket]);


    // =========================
    // 2. Fetch conversations
    // =========================

    useEffect(() => {
        if (!user?.id) return;

        fetchConversations();
    }, [user?.id, fetchConversations]);


    // =========================
    // 3. Realtime conversation
    // =========================

    useEffect(() => {
        if (!socket) return;

        const handleConversationUpdated = ({
            conversationId,
            lastMessage,
            unreadCount,
        }: {
            conversationId: number;
            lastMessage: any;
            unreadCount: number;
        }) => {
            updateConversation(
                conversationId,
                lastMessage,
                unreadCount
            );
        };

        const handleNewConversation = (conversation: any) => {
            addConversation(conversation);
        };

        socket.on(
            "conversationUpdated",
            handleConversationUpdated
        );

        socket.on(
            "newConversation",
            handleNewConversation
        );

        return () => {
            socket.off(
                "conversationUpdated",
                handleConversationUpdated
            );

            socket.off(
                "newConversation",
                handleNewConversation
            );
        };
    }, [
        socket,
        updateConversation,
        addConversation,
    ]);

    return null;
}