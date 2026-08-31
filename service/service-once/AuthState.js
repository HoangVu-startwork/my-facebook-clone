import { create } from "zustand";
// Zustand


import Auth from "@/service/user";

// ┌──────────────────────────┐
// │       AuthStore          │
// ├──────────────────────────┤
// │ user                     │ ← người đang đăng nhập
// │ loading                  │ ← đang kiểm tra login?
// │ fetched                  │ ← đã fetch user chưa?
// ├──────────────────────────┤
// │ fetchUser()              │ ← lấy thông tin user
// │ logout()                 │ ← đăng xuất
// └──────────────────────────┘



export const useAuthStore = create((set, get) => ({
    user: null,
    loading: false,
    fetched: false,

    // Gọi 1 lần duy nhất
    fetchUser: async () => {
        if (get().user) return; // chặn gọi lại
        set({ loading: true });

        try {
            const res = await Auth.gettoken();
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