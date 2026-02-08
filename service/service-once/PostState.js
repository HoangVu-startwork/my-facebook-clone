import { create } from "zustand";
import PostState from "@/service/post";
import Reaction from "../reaction";

export const usePostStore = create((set, get) => ({
    user: null,
    loading: false,
    fetched: false,

    // Gọi 1 lần duy nhất
    fetch: async () => {
        if (get().user) return; // chặn gọi lại
        set({ loading: true });

        try {
            const res = await PostState.getPost();
            set({ user: res.data.user })
        } catch (err) {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null });
    },
}))

export const useReactionStore = create((set, get) => ({
    reactions: [],

    fetchReactions: async () => {
        if (get().reactions.length) return;

        try {
            const data = await Reaction.getReaction();
            if (data) set({ reactions: data });
        } catch (err) {
            console.error(err);
        }
    },

    clearReactions: () => {
        Reaction.resetReaction();
        set({ reactions: [] });
    }
}));