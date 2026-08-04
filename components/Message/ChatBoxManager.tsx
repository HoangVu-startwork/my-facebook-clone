"use client";

import { ChatBox } from "./ChatBox";
import { useConversationStore } from "./conversationStore";

export default function ChatBoxManager() {
    const openConversations = useConversationStore(
        (s) => s.openConversations
    );

    const removeOpenConversation = useConversationStore(
        (s) => s.removeOpenConversation
    );

    return (
        <>
            {openConversations.map((conv, index) => (
                <ChatBox
                    key={conv.id}
                    conv={conv}
                    index={index}
                    onClose={() => removeOpenConversation(conv.id)}
                />
            ))}
        </>
    );
}