import { create } from "zustand"; // create dùng để tạo một global store.
// Zustand là một thư viện quản lý state (state management) cho React. 
// Nó cho phép tạo một store dùng chung để nhiều component có thể đọc và
// thay đổi dữ liệu mà không cần truyền props qua nhiều tầng.
// Nói đơn giản: Zustand = một nơi lưu state dùng chung cho toàn bộ ứng dụng React.

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


// Set -> Thay đổi state
// Get -> đọc state hiện tại
export const useAuthStore = create((set, get) => ({
    user: null, // Ban đầu chưa biết user có đăng nhập hay không
    // Cho nên user: null -> sau khi gọi Api: set({ user: res.data.user })
    // Thì thành: user = { id: 1, username: "abc", }

    loading: false, // Dùng để biết đang kiểm tra thông tin đăng nhập hay không.
    // Ban đầu: loading = false -> Khi bắt đầu gọi API: set({ loading: true });
    // Thì thành: loading = true -> API chạy xong:  set({ loading: false }); -> loading = false
    // Ví dụ: 
        // const loading = useAuthStore((state) => state.loading);
        // if (loading) { return <div>Đang kiểm tra đăng nhập...</div>; } -> khi api chạy xong thì sẽ tắt

    fetched: false, // Ý định của biến này là: Đã gọi API lấy user hay chưa?


    // Gọi 1 lần duy nhất
    fetchUser: async () => {
        // get().user -> Lấy giá trị user hiện tại trong Zustand store
        if (get().user) return; // chặn gọi lại -> Nếu Zustand đã có user rồi thì không gọi API nữa.
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