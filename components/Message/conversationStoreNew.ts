import { create } from "zustand";
import ConversationService from "@/service/conversation";

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

export interface ConversationType {
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
    // Tin nhắn chưa xem
    unreadCount: number;
}

interface ConversationStores {
    conversations: ConversationType[];

    // Cache gốc
    conversationCache: ConversationType[];

    openConversations: ConversationType[];

    loading: boolean;
    fetched: boolean;

    fetchConversations: (force?: boolean) => Promise<void>;

    updateConversation: (
        conversationId: number,
        lastMessage: LastMessage,
        unreadCount?: number
    ) => void;

    addConversation: (
        conversation: ConversationType
    ) => void;

    setConversations: (
        data: ConversationType[]
    ) => void;

    clearConversation: () => void;

    addOpenConversation: (
        conv: ConversationType
    ) => void;

    removeOpenConversation: (
        id: number
    ) => void;

    clearOpenConversations: () => void;

    increaseUnread: (
        conversationId: number
    ) => void;

    clearUnread: (
        conversationId: number
    ) => void;

    updateUnreadCount: (
        conversationId: number,
        unreadCount: number
    ) => void;
}

export const useConversationStore =
    create<ConversationStores>((set, get) => ({

        conversations: [],

        // Cache gốc
        conversationCache: [],

        openConversations: [],

        loading: false,

        fetched: false,


        // =========================
        // GET CONVERSATIONS
        // =========================

        fetchConversations: async (force = false) => {

            // Đã có cache thì không GET lại
            if (
                !force &&
                get().fetched
            ) {
                return;
            }

            // Đang GET thì không GET lần 2
            if (get().loading) {
                return;
            }

            set({
                loading: true
            });

            try {

                const res =
                    await ConversationService
                        .getConversation();

                const data =
                    res.data.data;

                set({

                    // CACHE GỐC
                    conversationCache: data,

                    // UI
                    conversations: data,

                    fetched: true,

                    loading: false

                });

            } catch (e) {

                set({
                    loading: false
                });

                console.error(
                    "fetchConversations:",
                    e
                );
            }
        },


        // =========================
        // SET CONVERSATIONS
        // =========================

        setConversations: (data) => {

            set({

                // cập nhật cache gốc
                conversationCache: data,

                // cập nhật UI
                conversations: data,

            });

        },


        // =========================
        // UPDATE CONVERSATION
        // =========================

        updateConversation: (
            conversationId,
            lastMessage,
            unreadCount
        ) => {

            set((state) => {

                const cache =
                    state.conversationCache.map(
                        (conversation) => {

                            if (
                                conversation.id !==
                                conversationId
                            ) {
                                return conversation;
                            }

                            return {

                                ...conversation,

                                lastMessage,

                                unreadCount:
                                    unreadCount !== undefined
                                        ? unreadCount
                                        : conversation.unreadCount

                            };
                        }
                    );


                // Tin nhắn mới nhất lên đầu
                cache.sort((a, b) => {

                    const timeA =
                        a.lastMessage
                            ? new Date(
                                a.lastMessage.createdAt
                            ).getTime()
                            : new Date(
                                a.createdAt
                            ).getTime();

                    const timeB =
                        b.lastMessage
                            ? new Date(
                                b.lastMessage.createdAt
                            ).getTime()
                            : new Date(
                                b.createdAt
                            ).getTime();

                    return timeB - timeA;

                });


                return {

                    // CACHE GỐC
                    conversationCache: cache,

                    // UI
                    conversations: cache,

                };

            });

        },


        // =========================
        // ADD CONVERSATION
        // =========================

        addConversation: (conversation) => {

            set((state) => {

                const exists =
                    state.conversationCache.some(
                        (c) =>
                            c.id ===
                            conversation.id
                    );

                if (exists) {
                    return state;
                }

                const cache = [
                    conversation,
                    ...state.conversationCache
                ];

                return {

                    conversationCache:
                        cache,

                    conversations:
                        cache

                };

            });

        },


        // =========================
        // CLEAR
        // =========================

        clearConversation: () => {

            set({

                conversations: [],

                conversationCache: [],

                loading: false,

                fetched: false

            });

        },


        // =========================
        // UNREAD
        // =========================

        increaseUnread: (
            conversationId
        ) => {

            set((state) => {

                const cache =
                    state.conversationCache.map(
                        (conversation) =>
                            conversation.id ===
                            conversationId
                                ? {
                                    ...conversation,

                                    unreadCount:
                                        (
                                            conversation.unreadCount ||
                                            0
                                        ) + 1
                                }
                                : conversation
                    );

                return {

                    conversationCache:
                        cache,

                    conversations:
                        cache

                };

            });

        },


        clearUnread: (
            conversationId
        ) => {

            set((state) => {

                const cache =
                    state.conversationCache.map(
                        (conversation) =>
                            conversation.id ===
                            conversationId
                                ? {
                                    ...conversation,

                                    unreadCount: 0
                                }
                                : conversation
                    );

                return {

                    conversationCache:
                        cache,

                    conversations:
                        cache

                };

            });

        },


        updateUnreadCount: (
            conversationId,
            unreadCount
        ) => {

            set((state) => {

                const cache =
                    state.conversationCache.map(
                        (conversation) =>
                            conversation.id ===
                            conversationId
                                ? {
                                    ...conversation,

                                    unreadCount
                                }
                                : conversation
                    );

                return {

                    conversationCache:
                        cache,

                    conversations:
                        cache

                };

            });

        },


        // =========================
        // OPEN CHATBOX
        // =========================

        addOpenConversation: (conv) =>
            set((state) => {

                const width =
                    typeof window !== "undefined"
                        ? window.innerWidth
                        : 1920;

                if (width < 550) {
                    return state;
                }

                // 550 - 999
                if (width < 1000) {

                    if (
                        state.openConversations[0]?.id ===
                        conv.id
                    ) {
                        return state;
                    }

                    return {
                        openConversations: [conv]
                    };
                }

                // >= 1000

                if (
                    state.openConversations.some(
                        (c) =>
                            c.id === conv.id
                    )
                ) {
                    return state;
                }

                if (
                    state.openConversations.length < 4
                ) {

                    return {
                        openConversations: [
                            ...state.openConversations,
                            conv
                        ]
                    };

                }

                return {

                    openConversations: [
                        ...state.openConversations.slice(1),
                        conv
                    ]

                };

            }),


        removeOpenConversation: (id) =>
            set((state) => ({
                openConversations:
                    state.openConversations.filter(
                        (c) =>
                            c.id !== id
                    )
            })),


        clearOpenConversations: () =>
            set({
                openConversations: []
            })

    }));