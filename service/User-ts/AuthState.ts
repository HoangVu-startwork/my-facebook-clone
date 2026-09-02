import { create } from "zustand";
import Auth from "@/service/user";

interface User {
    id: number;
    username: string;
    email: string;
    avatUrl: string | null;
}

interface AuthState {
    user: User | null;

    // Đang gọi API
    loading: boolean;

    // Đã kiểm tra user thành công hay chưa
    fetched: boolean;

    // Chặn nhiều request fetchUser chạy cùng lúc
    fetching: boolean;

    fetchUser: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: false,
    fetched: false,
    fetching: false,

    fetchUser: async () => {
        const { fetched, fetching } = get();

        // Đã fetch thành công rồi → không gọi lại
        if (fetched) return;

        // Đang có request chạy → không gọi thêm request
        if (fetching) return;

        set({
            loading: true,
            fetching: true,
        });

        try {
            const res = await Auth.gettoken();

            set({
                user: res.data.user,
                fetched: true,
            });
        } catch (err) {
            console.error("fetchUser error:", err);

            set({
                user: null,

                // API thất bại → cho phép lần sau thử lại
                fetched: false,
            });
        } finally {
            set({
                loading: false,
                fetching: false,
            });
        }
    },

    logout: () => {
        localStorage.removeItem("token");

        set({
            user: null,
            fetched: false,
            loading: false,
            fetching: false,
        });
    },
}));