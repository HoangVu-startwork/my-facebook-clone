import { create } from "zustand";
import FilendService from "../filend";

export const useFriendStore = create((set, get) => ({
    friends: [],
    loading: false,
    fetched: false,
    version: 0,
    // Load lần đầu
    fetchFriends: async (force = false) => {
        if (get().fetched && !force) return;

        // set({ loading: true });

        try {
            const res = await FilendService.getUserFriends();

            set({
                friends: res.data.data,
                version: res.data.version,
                fetched: true
            });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },

    // Add local
    addFriend: (friend) => {
        set((state) => ({
            friends: [...state.friends, friend]
        }));
    },

    // Remove local
    removeFriend: (friendId) => {
        set((state) => ({
            friends: state.friends.filter(
                (friend) => friend.id !== friendId
            )
        }));
    },

    // Update local
    updateFriend: (friendId, newData) => {
        set((state) => ({
            friends: state.friends.map((friend) =>
                friend.id === friendId
                    ? { ...friend, ...newData }
                    : friend
            )
        }));
    },

    // Server báo có data mới
    invalidateFriends: () => {
        set({ fetched: false });
    },

    clearFriends: () => {
        set({
            friends: [],
            fetched: false
        });
    }
}))