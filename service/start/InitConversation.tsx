"use client";

import { useEffect } from "react";
import { useConversationStore } from "@/components/Message/conversationStoreNew";
import { useAuthStore } from "@/service/service-once/AuthState";

export default function InitConversation() {
    const user = useAuthStore((state) => state.user);
    const fetchConversations = useConversationStore(
        (state) => state.fetchConversations
    );

    useEffect(() => {
        if (!user) return;

        fetchConversations();
    }, [user, fetchConversations]);

    return null;
}