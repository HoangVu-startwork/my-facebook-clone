"use client";

import { useEffect } from "react";
import { useConversationStore } from "@/components/Message/conversationStoreNew";

export default function InitConversation() {
    const fetchConversations = useConversationStore(
        (state) => state.fetchConversations
    );

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return null;
}