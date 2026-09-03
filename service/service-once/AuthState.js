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
export const useAuthStore1 = create((set, get) => ({
    user: null, // Ban đầu chưa biết user có đăng nhập hay không
    // Cho nên user: null -> sau khi gọi Api: set({ user: res.data.user })
    // Thì thành: user = { id: 1, username: "abc", }

    loading: false, // Dùng để biết đang kiểm tra thông tin đăng nhập hay không.
    // Ban đầu: loading = false -> Khi bắt đầu gọi API: set({ loading: true });
    // Thì thành: loading = true -> API chạy xong:  set({ loading: false }); -> loading = false
    // Ví dụ: 
    // const loading = useAuthStore((state) => state.loading);
    // if (loading) { return <div>Đang kiểm tra đăng nhập...</div>; } -> khi api chạy xong thì sẽ tắt


    // Đã kiểm tra user thành công hay chưa
    fetched: false, // Ý định của biến này là: Đã gọi API lấy user hay chưa?

    // Đang có request fetchUser chạy 
    fetching: false,

    // Gọi 1 lần duy nhất
    fetchUser1: async () => { // -> Gọi backend để kiểm tra token và lấy thông tin user hiện tại.
        // get().user -> Lấy giá trị user hiện tại trong Zustand store
        if (get().user) return; // chặn gọi lại -> Nếu Zustand đã có user rồi thì không gọi API nữa.
        // Ví dụ lần đầu :
        // 1: user = null -> chạy fetchUser() = điều kiện if (get().user) tức là if (null) -> false tiếp tực gọi api
        // Sau khi gọi api: set({ user: res.data.user }) -> ví dụ user = { id: 5, username: "vũ" } -> Lần sau gọi: fetchUser()
        // Thì if (get().user) return; tương đương: if ({ id: 5, username: "vũ" }) { return; } -> Kết quả: true -> thoát luôn Không gọi API nữa

        set({ loading: true });
        // Bắt đầu Loading -> Sau khi qua đoạn if (get().user) return; 
        // chạy : set({ loading: true });
        // fetchUser()
        //        ↓
        //  user đã có chưa?
        //       ↓
        //     chưa
        //       ↓
        //  loading = true
        //       ↓
        //  gọi API
        try {
            const res = await Auth.gettoken();
            set({ user: res.data.user }) // đưa user vào Zustand.
            // Store -> {
            //     user: {
            //         id: 1,
            //         username: "vuvu"
            //     },
            //     loading: true,
            //     fetched: false
            // }
        } catch (err) {
            set({ user: null });
            // Nếu API bị lỗi: -> Auth.gettoken() ->  backend -> 401 Unauthorized -> catch
            // -> kết quả: user = null -> User hiện tại không đăng nhập / token không hợp lệ.
        } finally {
            set({ loading: false });
            // Store -> {
            //     user: {
            //         id: 1,
            //         username: "vuvu"
            //     },
            //     loading: false,
            //     fetched: false
            // }
            //         fetchUser()
            //             │
            //             ▼
            //     loading = true
            //             │
            //     ┌──────┴──────┐
            //     ▼             ▼
            // SUCCESS         ERROR
            //     │             │
            //     ▼             ▼
            // set(user)       user=null
            //     │             │
            //     └──────┬──────┘
            //             ▼
            //     finally
            //             │
            //             ▼
            //     loading = false
        }
    },

    // Nhưng có một điểm cần suy nghĩ: nếu request API thất bại vì mạng tạm thời, fetched: true sẽ khiến bạn không thử lại nữa. 
    // Vì vậy trong app thực tế, thường sẽ tách trạng thái initialized/fetched và xử lý retry cẩn thận.

    //----------------------------------------------------//
    // Trường hợp này hướng API thành công mới đánh dấu fetched = true. 
    // Nếu API lỗi do mạng/server thì fetched vẫn là false, lần sau có thể gọi lại.
    // Và thêm fetching để chặn 2 component gọi fetchUser() cùng lúc, tránh gửi 2 request.
    fetchUser: async () => {
        const { fetched, fetching } = get();

        // Đã fetch thành công rồi → không gọi lại 
        if (fetched) return;

        // Đang có request chạy → không gọi thêm request 
        if (fetching) return;

        // Bắt đầu gọi API
        set ({
            loading: true,
            fetching: true
        });

        try {
            const res = await Auth.gettoken(); // API thành công 
            set({ user: res.data.user, fetched: true, });
        } catch (err) {
            // API thất bại 
            set({ user: null, fetched: false, });
        } finally {
            // Request kết thúc 
            set({ loading: false, fetching: false, });
        }
    },


    logout: () => {
        localStorage.removeItem("token");
        // Reset AuthStore 
        set({ user: null, fetched: false, loading: false, fetching: false, });
    },
}))


