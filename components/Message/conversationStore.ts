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
}

interface ConversationStore {
    conversations: ConversationType[];

    openConversations: ConversationType[];
    addOpenConversation: (conv: ConversationType) => void;

    removeOpenConversation: (id: number) => void;

    clearOpenConversations: () => void;

    loading: boolean;
    fetched: boolean;

    fetchConversations: (force?: boolean) => Promise<void>;

    setConversations: (data: ConversationType[]) => void;

    updateConversation: (
        conversationId: number,
        lastMessage: LastMessage
    ) => void;

    addConversation: (conversation: ConversationType) => void;

    clearConversation: () => void;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
    conversations: [],
    openConversations: [],
    loading: false,
    fetched: false,

    fetchConversations: async (force = false) => {
        if (!force && get().fetched) return;
        if (get().loading) return;

        set({ loading: true });

        try {
            const res = await ConversationService.getConversation();

            set({
                conversations: res.data.data,
                fetched: true,
                loading: false,
            });
        } catch (e) {
            set({ loading: false });
            console.log(e);
        }
    },

    setConversations: (data) =>
        set({
            conversations: data,
        }),

    updateConversation: (conversationId, lastMessage) =>
        set((state) => {
            const list = [...state.conversations];

            const index = list.findIndex((c) => c.id === conversationId);

            if (index === -1) return state;

            const conversation = {
                ...list[index],
                lastMessage,
            };

            list.splice(index, 1);
            list.unshift(conversation);

            return {
                conversations: list,
            };
        }),

    addConversation: (conversation) =>
        set((state) => {
            const exists = state.conversations.some(
                (c) => c.id === conversation.id
            );

            if (exists) return state;

            return {
                conversations: [conversation, ...state.conversations],
            };
        }),

    clearConversation: () =>
        set({
            conversations: [],
            loading: false,
            fetched: false,
        }),

    // addOpenConversation: (conv: ConversationType) =>
    //     set((state) => {
    //         if (
    //             state.openConversations.some(
    //                 (c) => c.id === conv.id
    //             )
    //         ) {
    //             return state;
    //         }

    //         if (state.openConversations.length < 4) {
    //             return {
    //                 openConversations: [
    //                     ...state.openConversations,
    //                     conv,
    //                 ],
    //             };
    //         }

    //         return {
    //             openConversations: [
    //                 ...state.openConversations.slice(1),
    //                 conv,
    //             ],
    //         };
    //     }),
    // ≥ 1000px: hiển thị tối đa 4 ChatBox như hiện tại. - 550px – 999px: chỉ hiển thị 1 ChatBox.
    addOpenConversation: (conv: ConversationType) =>
        set((state) => {
            const width =
                typeof window !== "undefined"
                    ? window.innerWidth
                    : 1920;
    
            if (width < 550) {
                return state;
            }
    
            if (width < 1000) {
                if (
                    state.openConversations[0]?.id === conv.id
                ) {
                    return state;
                }
    
                return {
                    openConversations: [conv],
                };
            }
    
            if (
                state.openConversations.some(
                    (c) => c.id === conv.id
                )
            ) {
                return state;
            }
    
            if (state.openConversations.length < 4) {
                return {
                    openConversations: [
                        ...state.openConversations,
                        conv,
                    ],
                };
            }
    
            return {
                openConversations: [
                    ...state.openConversations.slice(1),
                    conv,
                ],
            };
        }),

    removeOpenConversation: (id: number) =>
        set((state) => ({
            openConversations:
                state.openConversations.filter(
                    (c) => c.id !== id
                ),
        })),

    clearOpenConversations: () =>
        set({
            openConversations: [],
        }),
}));