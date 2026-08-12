"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useSocketStore } from "@/service/sockets/userSocketStore";
import { useAuthStore } from "@/service/service-once/AuthState";
import Conversation from "@/service/conversation";
import image_vavart_null from "@/public/image/avatuser_null.png";
import ServiceMessages from "@/service/messages";
import { useConversationStore } from "@/components/Message/conversationStoreNew";
import { ChatBox } from "@/components/Message/ChatBox";
import "../Message/style.css";


interface UserInfo {
    id: number;
    username: string;
    avatUrl: string | null;
}

interface Topic {
    id: number;
    label: string;
    title: string | null;
    img: string | null;
    color: string | null;
    color_1: string | null;
    color_2: string | null;
    color_icon: string | null;
}

interface ConversationType {
    id: number;
    type: "private" | "group";
    userOneId: number;
    userTwoId: number;
    createdAt: string;
    updatedAt?: string | null;
    avatConversation?: string | null;
    lastMessageAt?: string | null;
    leaderId?: number | null;
    title?: string | null;
    friend?: UserInfo;
    topic?: Topic;
    lastMessage?: LastMessage;
    unreadCount: number;
}

interface LastMessage {
    id: number;
    content: string;
    contentType: string;
    createdAt: string;
    message_status: string;
    sender?: {
        id: number;
        username: string;
        avatUrl: string | null;
    };
}

export default function () {

    const [showMessage, setShowMessage] = useState(false);
    const socket = useSocketStore((s) => s.socket);
    const currentUserId = useAuthStore((s) => s.user?.id);

    const conversations = useConversationStore(
        (s) => s.conversations
    );

    const fetchConversations = useConversationStore(
        (s) => s.fetchConversations
    );

    const updateConversation =
        useConversationStore(
            (s) => s.updateConversation
        );

    const addConversation = useConversationStore(
        (s) => s.addConversation
    );

    //const [openConversations, setOpenConversations] = useState<ConversationType[]>([]);

    const openConversations = useConversationStore(
        (s) => s.openConversations
    );

    const addOpenConversation = useConversationStore(
        (s) => s.addOpenConversation
    );

    const removeOpenConversation = useConversationStore(
        (s) => s.removeOpenConversation
    );


    const bottomRef = useRef<HTMLDivElement>(null);

    const normalizeConversation = (data: any): ConversationType => {
        return {
            ...data,
            avatConversation: data.avatConversation ?? null,
            lastMessageAt: data.lastMessageAt ?? null,
            leaderId: data.leaderId ?? null,
            title: data.title ?? null,
            updatedAt: data.updatedAt ?? data.createdAt,
        };
    };

    // Load conversations lần đầu
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Scroll xuống cuối
    useLayoutEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, []);

    // Có tin nhắn mới
    useEffect(() => {
        if (!socket) return;

        const handleConversationUpdated = ({
            conversationId,
            lastMessage,
            unreadCount
        }: {
            conversationId: number;
            lastMessage: LastMessage;
            unreadCount: number;
        }) => {
            updateConversation(conversationId, lastMessage, unreadCount);
        };

        socket.on(
            "conversationUpdated",
            handleConversationUpdated
        );

        return () => {
            socket.off(
                "conversationUpdated",
                handleConversationUpdated
            );
        };
    }, [socket, updateConversation]);

    // Có cuộc trò chuyện mới
    useEffect(() => {
        if (!socket) return;

        const onNewConversation = (
            data: ConversationType
        ) => {
            addConversation(
                normalizeConversation(data)
            );
        };

        socket.on("newConversation", onNewConversation);

        return () => {
            socket.off(
                "newConversation",
                onNewConversation
            );
        };
    }, [socket, addConversation]);

    // Tổng tin nhắn chưa xem
    const unreadConversationCount = conversations.filter(
        (conversation) =>
            (conversation.unreadCount || 0) > 0
    ).length;

    const totalUnreadMessages = conversations.reduce(
        (total, conversation) =>
            total + (conversation.unreadCount || 0),
        0
    );

    return (
        <>
            <div className="relative">
                <span>Tin nhắn</span>

                {unreadConversationCount > 0 && (
                    <span className="
            absolute
            -top-2
            -right-4
            min-w-[20px]
            h-[20px]
            px-1
            rounded-full
            bg-red-500
            text-white
            text-xs
            flex
            items-center
            justify-center
        ">
                        {unreadConversationCount > 99
                            ? "99+"
                            : unreadConversationCount}
                    </span>
                )}
            </div>
            {totalUnreadMessages > 0 && (
                <span>
                    {totalUnreadMessages > 99
                        ? "99+"
                        : totalUnreadMessages}
                </span>
            )}
            <div>
                {conversations.map(u => {

                    const renderLastMessage = (
                        lastMessage?: LastMessage,
                    ) => {
                        if (!lastMessage) {
                            return (
                                <div className="text-gray-500 italic">
                                    Bạn có thể bắt gửi tin nhắn
                                </div>
                            );
                        }


                        const isMe = lastMessage.sender?.id === currentUserId;

                        if (lastMessage.message_status !== "show") {
                            return (
                                <div className="italic text-gray-500">
                                    {isMe ? "Bạn đã thu hồi một tin nhắn" : "Tin nhắn đã bị thu hồi"}
                                </div>
                            );
                        }

                        switch (lastMessage.contentType) {
                            case "text":
                                return (
                                    <div className="truncate">
                                        {isMe && <span className="font-medium">Bạn: </span>}
                                        {lastMessage.content.length > 22
                                            ? `${lastMessage.content.slice(0, 22)}...`
                                            : lastMessage.content}
                                    </div>
                                );

                            case "image":
                                return (
                                    <div className="italic">
                                        {isMe && "Bạn: "}📷 Hình ảnh
                                    </div>
                                );

                            case "video":
                                return (
                                    <div className="italic">
                                        {isMe && "Bạn: "}🎥 Video
                                    </div>
                                );

                            case "file":
                                return (
                                    <div className="italic">
                                        {isMe && "Bạn: "}📎 Tệp đính kèm
                                    </div>
                                );

                            default:
                                return null;
                        }
                    };
                    return (
                        <div key={u.id}
                            onClick={() => {
                                addOpenConversation(u);
                            }}

                        >
                            <div className="conversation_message_div">
                                <div className="conversation_message_div_1">
                                    <img
                                        src={u.friend?.avatUrl || image_vavart_null.src}
                                        alt="avatar"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {u.unreadCount > 0 && (
                                        <span
                                            className="
                                                absolute
                                                -top-1
                                                -right-1
                                                min-w-[20px]
                                                h-[20px]
                                                px-1
                                                rounded-full
                                                bg-red-500
                                                text-white
                                                text-[11px]
                                                font-semibold
                                                flex
                                                items-center
                                                justify-center
                                                border-2
                                                border-white
                                            "
                                        >
                                            {u.unreadCount > 99
                                                ? "99+"
                                                : u.unreadCount}
                                        </span>
                                    )}
                                </div>

                                <div className="conversation_message_div_2">
                                    <div>{u.friend?.username || "Unknown"}</div>
                                    <div>
                                        {renderLastMessage(u.lastMessage)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* {openConversations.map((conv, index) => (
                <ChatBox
                    key={conv.id}
                    conv={conv}
                    index={index}
                    onClose={() => removeOpenConversation(conv.id)}
                />
            ))} */}
        </>
    )
}
