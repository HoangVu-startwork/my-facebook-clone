"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useSocketStore } from "@/service/sockets/userSocketStore";
import Conversation from "@/service/conversation";
import image_vavart_null from "@/public/image/avatuser_null.png";
import ServiceMessages from "@/service/messages";
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
}
export default function () {
    const [conversations, setConversations] = useState<ConversationType[]>([]);
    const [openConversations, setOpenConversations] = useState<ConversationType[]>([]);
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
    const socket = useSocketStore((s) => s.socket);
    useEffect(() => {
        if (!socket) return;

        const onNewConversation = (data: ConversationType) => {
            const normalized = normalizeConversation(data);

            setConversations(prev => {
                const exists = prev.some(c => c.id === normalized.id);
                if (exists) return prev;

                const updated = [normalized, ...prev];

                // Sort theo mới nhất
                return updated.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
            });
        };

        socket.on("newConversation", onNewConversation);

        return () => {
            socket.off("newConversation", onNewConversation);
        };
    }, [socket]);

    const didFetch = useRef(false);

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        const fetchData = async () => {
            try {
                const res = await Conversation.getConversation();
                setConversations(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const bottomRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        bottomRef.current?.scrollIntoView();
    }, []);



    return (
        <>
            <div>
                {conversations.map(u => {
                    return (
                        <div key={u.id}
                            onClick={() => {
                                setOpenConversations(prev => {
                                    // Nếu đã mở rồi → không thêm nữa
                                    const exists = prev.find(c => c.id === u.id);
                                    if (exists) return prev;

                                    // Nếu chưa đủ 4 → thêm vào
                                    if (prev.length < 4) {
                                        return [...prev, u];
                                    }

                                    // Nếu đã đủ 4 → bỏ cái cũ nhất (index 0)
                                    return [...prev.slice(1), u];
                                });
                            }}

                        >
                            <div>
                                <div>
                                    <img
                                        src={u.friend?.avatUrl || image_vavart_null.src}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                </div>

                                <div>
                                    <div>{u.friend?.username || "Unknown"}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {openConversations.map((conv, index) => (
                <ChatBox
                    key={conv.id}
                    conv={conv}
                    index={index}
                    onClose={() =>
                        setOpenConversations(prev =>
                            prev.filter(c => c.id !== conv.id)
                        )
                    }
                />
            ))}



        </>
    )
}

interface ChatMessage {
    id: number;
    content: string;
    conversationId: number;
    sender: {
        id: number;
        username: string;
    };
    message_status: string;
    contentType: "text" | "image" | "video" | "file";
    status?: string;
    createdAt: string;
    updatedAt: string;
    replyToId: number | null;
    senderId: number;
}

import { useAuthStore } from "@/service/service-once/AuthState"
function ChatBox({ conv, index, onClose }: any) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [now, setNow] = useState(Date.now());


    const currentUserId = useAuthStore((s) => s.user?.id);

    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if ((!content && !file) || isSending) return;

        setIsSending(true);

        try {
            await ServiceMessages.reactMessages({
                receiverId: conv.friend.id,
                content,
                file
            });

            setContent("");
            setFile(null);
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });

        } catch (err) {
            console.error("Gửi thất bại");
        } finally {
            setIsSending(false);
        }
    };

    const didFetch = useRef(false);

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        const fetchMessages = async () => {
            try {
                const res = await ServiceMessages.getMessages(conv.id);
                console.log(res.data.data)
                setMessages(res.data.data);
            } catch (err) {
                console.error("Lỗi load message", err);
            }
        };

        fetchMessages();
    }, [conv.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const container = bottomRef.current?.parentElement;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    type FileType = "pdf" | "word" | "excel" | "file";

    const FILE_CONFIG: Record<
        FileType,
        { label: string; color: string; bg: string }
    > = {
        pdf: {
            label: "PDF",
            color: "text-red-500",
            bg: "bg-red-50",
        },
        word: {
            label: "WORD",
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        excel: {
            label: "EXCEL",
            color: "text-green-600",
            bg: "bg-green-50",
        },
        file: {
            label: "FILE",
            color: "text-gray-600",
            bg: "bg-gray-100",
        },
    };

    const getFileType = (url?: string): FileType => {
        if (!url) return "file";

        const ext = url.split(".").pop()?.toLowerCase();

        if (ext === "pdf") return "pdf";
        if (ext === "doc" || ext === "docx") return "word";
        if (ext === "xls" || ext === "xlsx") return "excel";

        return "file";
    };



    const getFileNameFromUrl = (url?: string) => {
        if (!url) return "";

        try {
            const cleanUrl = url.split("?")[0]; // bỏ query
            const fileName = cleanUrl.split("/").pop();
            return fileName ? decodeURIComponent(fileName) : "";
        } catch {
            return "";
        }
    };


    // Format thời gian cố định tin nhan mới nhất trong ngày
    const parseCustomDate = (dateString: string) => {
        const [timePart, datePart] = dateString.split(" ");

        const [hours, minutes, seconds] = timePart.split(":").map(Number);
        const [day, month, year] = datePart.split("-").map(Number);

        return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const formatFullDateTime = (dateString: string) => {
        const d = parseCustomDate(dateString);

        const time = d.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        const date = d.toLocaleDateString("vi-VN");

        return `${time} - ${date}`;
    };


    const isDifferentDay = (d1: string, d2: string) => {
        const date1 = parseCustomDate(d1);
        const date2 = parseCustomDate(d2);

        return (
            date1.getFullYear() !== date2.getFullYear() ||
            date1.getMonth() !== date2.getMonth() ||
            date1.getDate() !== date2.getDate()
        );
    };


    // thời gian tin nhắn gửi với hiện tại trong ngày
    const getDisplayTimeFromNow = (createdAt: string) => {
        const messageDate = parseCustomDate(createdAt);

        const diffMs = now - messageDate.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMinutes < 60) {
            return diffMinutes <= 1
                ? "1 phút trước"
                : `${diffMinutes} phút trước`;
        }

        if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        }

        return formatFullDateTime(createdAt);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 60000); // mỗi 60 giây

        return () => clearInterval(interval);
    }, []);


    // Khi nhấn vào sẽ di chuyển tới tin nhắn trả lời
    const scrollToMessage = (id: any) => {
        const element = document.getElementById(`msg-${id}`);
        if (!element) return;

        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        // highlight tạm thời
        element.classList.add("highlight-msg");

        setTimeout(() => {
            element.classList.remove("highlight-msg");
        }, 2000);
    };


    // const socket = useSocketStore((s) => s.socket);

    // useEffect(() => {
    //     const handleNewMessage = (data: ChatMessage) => {
    //         setMessages(prev => {
    //             const exists = prev.some(m => m.id === data.id);
    //             if (exists) return prev;
    //             return [...prev, data];
    //         });

    //         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    //     };

    //     socket.on("newConversationmes", handleNewMessage);

    //     return () => {
    //         socket.off("newConversationmes", handleNewMessage);
    //     };
    // }, []);
    const socket = useSocketStore((s) => s.socket);

    useEffect(() => {
        if (!socket || !conv?.id) return;

        // 🔹 Join room theo conversationId
        socket.emit("joinConversation", conv.id);

        const handleNewMessage = (data: ChatMessage) => {
            // 🔥 Chỉ nhận message thuộc conversation hiện tại
            if (data.conversationId !== conv.id) return;

            setMessages((prev) => {
                const exists = prev.some((m) => m.id === data.id);
                if (exists) return prev;
                return [...prev, data];
            });

            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        const handleMessagesRead = ({
            conversationId,
            readerId,
            lastMessageId,
            isRead
        }: any) => {

            if (conversationId !== conv.id) return;

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id <= lastMessageId &&
                        msg.senderId !== readerId
                        ? { ...msg, isRead }
                        : msg
                )
            );
        };

        // socket.on("newConversationmes", handleNewMessage);

        // return () => {
        //     socket.emit("leaveConversation", conv.id);
        //     socket.off("newConversationmes", handleNewMessage);
        // };

        socket.on("newConversationmes", handleNewMessage);
        socket.on("messagesRead", handleMessagesRead);

        return () => {
            socket.emit("leaveConversation", conv.id);
            socket.off("newConversationmes", handleNewMessage);
            socket.off("messagesRead", handleMessagesRead);
        };

    }, [socket, conv?.id]);

    //
    useEffect(() => {
        if (!messages.length) return;

        // Lấy tin nhắn cuối cùng của người khác gửi
        const unreadMessages = messages.filter(
            (msg) =>
                msg.senderId !== currentUserId &&
                !msg.isRead
        );

        if (unreadMessages.length === 0) return;

        const lastMessage = unreadMessages[unreadMessages.length - 1];
        console.log(conv.id, lastMessage.id)
        ServiceMessages.putMessagesXem(conv.id, lastMessage.id)
            .catch((err) => console.error("Lỗi mark read", err));

    }, [messages, conv.id, currentUserId]);

    const [showReadTimeId, setShowReadTimeId] = useState<number | null>(null);

    return (
        <div
            className="khung-message fixed flex flex-col w-[295px] h-[650px] bottom-2"
            style={{
                right: `${index * 300 + 10}px`,
                backgroundColor: conv.topic?.color || "#ffffff"
            }}
        >
            {/* Header */}
            <div className="khung-message_div_1 flex justify-between p-3">
                <div className="flex khung-message_div_1_1">
                    <img
                        src={conv.friend?.avatUrl || image_vavart_null.src}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="khung-message_div_1_1_span">{conv.friend?.username}</span>
                </div>
                <button className="khung-message_div_1_button" onClick={onClose}
                    style={{
                        color: conv.topic?.color_icon || "#ffffff"
                    }}
                >✕</button>
            </div>

            {/* Messages */}
            <div className="khung-message_div_2 flex-1 overflow-y-auto p-3">
                {messages.map((msg, index) => {
                    const isMe = msg.sender?.id === currentUserId;
                    const prevMsg = messages[index - 1];

                    const showDateSeparator =
                        index === 0 ||
                        (prevMsg && isDifferentDay(msg.createdAt, prevMsg.createdAt));

                    const repliedMsg = msg.replyToId
                        ? messages.find(m => m.id === msg.replyToId)
                        : null;

                    return (
                        <div key={msg.id} id={`msg-${msg.id}`}>
                            {showDateSeparator && (
                                <div className="flex justify-center my-4">
                                    <span className="text-xs text-blue-50 px-1 py-1 rounded-full khung-message_div_2_createdAt">
                                        {formatFullDateTime(msg.createdAt)}
                                    </span>
                                </div>
                            )}

                            {/* <div className={`mb-3 flex flex-col ${isMe ? "items-end" : "items-start"}`}> */}
                            <div
                                className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
                            >
                                {!isMe && (
                                    <img
                                        src={msg.sender?.avatUrl || image_vavart_null.src}
                                        alt="avatar"
                                        className="w-6 h-6 rounded-full object-cover mb-4"
                                    />
                                )}

                                <div className={`flex flex-col max-w-[82%] ${isMe ? "message_conversation_1" : "message_conversation_2"}`}>
                                    {/* 🔹 REPLY PREVIEW */}
                                    {repliedMsg && (
                                        <div
                                            style={{
                                                backgroundColor: isMe
                                                    ? conv.topic?.color_2 || "#ef4444"
                                                    : conv.topic?.color_1 || "#3b82f6"
                                            }}
                                            className={`mb-1 px-3 py-2 rounded-xl max-w-[82%] text-xs border-l-4 border-white/40 backdrop-blur-sm ${isMe ? "user_topic_1" : "user_topic_2"}`}
                                        >
                                            {repliedMsg.sender?.id !== currentUserId ? (
                                                <div
                                                    className="font-semibold truncate cursor-pointer hover:underline"
                                                    onClick={() => scrollToMessage(repliedMsg.id)}
                                                >
                                                    {msg.sender?.username} đã trả lời {repliedMsg.sender?.username}
                                                </div>
                                            ) : (
                                                <div
                                                    className="font-semibold truncate cursor-pointer hover:underline"
                                                    onClick={() => scrollToMessage(repliedMsg.id)}
                                                >
                                                    {msg.sender?.username} đã trả lời {repliedMsg.sender?.username}
                                                </div>
                                            )}

                                            {repliedMsg.contentType === "text" && (
                                                <div className="truncate">
                                                    {repliedMsg.content}
                                                </div>
                                            )}

                                            {repliedMsg.contentType === "image" && (
                                                <div className="italic">📷 Hình ảnh</div>
                                            )}

                                            {repliedMsg.contentType === "video" && (
                                                <div className="italic">🎥 Video</div>
                                            )}

                                            {repliedMsg.contentType === "file" && (
                                                <div className="italic">📎 Tệp đính kèm</div>
                                            )}
                                        </div>
                                    )}

                                    {/* TEXT MESSAGE */}
                                    {msg.contentType === "text" && (
                                        <div
                                            className={`px-3 py-2 rounded-2xl text-sm text-white ${isMe ? "message_conversation_1_1" : "message_conversation_2_1"} `}
                                            style={{
                                                backgroundColor: isMe
                                                    ? conv.topic?.color_1 || "#ef4444"
                                                    : conv.topic?.color_2 || "#3b82f6"
                                            }}
                                        >
                                            {msg.content}
                                        </div>
                                    )}

                                    {/* IMAGE */}
                                    {msg.contentType === "image" && (
                                        <img
                                            src={msg.content}
                                            alt="media"
                                            className="max-h-[60vh] rounded-xl object-contain"
                                        />
                                    )}

                                    {/* VIDEO */}
                                    {msg.contentType === "video" && (
                                        <video
                                            src={msg.content}
                                            controls
                                            className="max-w-[80%] max-h-[200px] rounded-xl"
                                        />
                                    )}

                                    {/* FILE */}
                                    {msg.contentType === "file" && (() => {
                                        const fileType = getFileType(msg.content);
                                        const config = FILE_CONFIG[fileType];
                                        const fileName =
                                            msg.fileName || getFileNameFromUrl(msg.content);

                                        return (
                                            <a
                                                href={msg.content}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 rounded-xl max-w-[80%] bg-gray-200 hover:bg-gray-100 transition"
                                            >
                                                <div
                                                    className={`w-9 h-8 flex items-center justify-center rounded border ${config.bg}`}
                                                >
                                                    <span className={`font-bold text-xs ${config.color}`}>
                                                        {config.label}
                                                    </span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500 uppercase font-bold">
                                                        {config.label}
                                                    </p>
                                                    <p className="font-medium text-xs truncate">
                                                        {fileName}
                                                    </p>
                                                </div>
                                            </a>
                                        );
                                    })()}

                                    <span className="MsgcreatedAt mt-1">
                                        {getDisplayTimeFromNow(msg.createdAt)}

                                        {msg.senderId === currentUserId && (
                                            <>
                                                {" "}
                                                -{" "}
                                                <span
                                                    className="text-xs text-gray-300 cursor-pointer hover:text-blue-400"
                                                    onClick={() =>
                                                        setShowReadTimeId(
                                                            showReadTimeId === msg.id ? null : msg.id
                                                        )
                                                    }
                                                >
                                                    {msg.isRead ? "Đã xem" : "Đã gửi"}
                                                </span>

                                                {msg.isRead && showReadTimeId === msg.id && (
                                                    <div className="text-[11px] text-gray-400 mt-1">
                                                        Xem lúc {msg.createdAt}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {/* {getDisplayTimeFromNow(msg.createdAt)} {msg.senderId === currentUserId && (
                                            <span className="text-xs text-gray-300"> - {msg.isRead ? "Đã xem" : "Đã gửi"} </span>
                                        )} */}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}


                <div ref={bottomRef} />
            </div>

            <div className="khung-message_div_3 p-2 border-t flex items-center gap-2">

                <input
                    type="file"
                    hidden
                    id={`file-${conv.id}`}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                <label htmlFor={`file-${conv.id}`} className="cursor-pointer">
                    📎
                </label>

                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 border rounded-full px-3 py-2 text-sm"
                    placeholder="Nhập tin nhắn..."
                />

                <button onClick={handleSend}>➤</button>
            </div>
        </div>
    );
}

// useEffect(() => {
//     if (!socket) return;

//     const onNewConversation = (data: ConversationType) => {
//         console.log("🔥 Socket nhận được:", data);
//         setConversations(prev => {
//             const exists = prev.find(c => c.id === data.id);
//             if (exists) return prev;
//             return [data, ...prev];
//         });
//     };
//     socket.on("newConversation", onNewConversation);

//     return () => {
//         socket.off("newConversation", onNewConversation);
//     };
// }, [socket]);


// // chỉ gọi 1 lần
// const didFetch = useRef(false);
// useEffect(() => {
//     if (didFetch.current) return;
//     didFetch.current = true;
//     getConversation();
// }, []);
