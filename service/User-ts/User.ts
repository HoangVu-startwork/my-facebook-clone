import api from "@/api/api";
import axios, { AxiosResponse } from "axios";
// Axios Là thư viện dùng để gọi API
// AxiosResponse -> Đây là type mô tả cấu trúc response mà Axios trả về.

interface User {
    id: number;
    username: string;
    email: string;
    avatUrl: string | null;
}

interface VerifyResponse {
    user: User;
}

const Auth = {
    gettoken: async (): Promise<AxiosResponse<VerifyResponse>> => {
        // Promise<AxiosResponse<VerifyResponse>>
        // Function gettoken() sẽ trả về một Promise, và khi Promise hoàn thành thì kết quả là AxiosResponse<VerifyResponse>.
        // Tách ra: Promise -> AxiosResponse -> VerifyResponse
        // VerifyResponse: Ta có interface VerifyResponse { user: User; }
        // -> Nên: AxiosResponse<VerifyResponse> -> có nghĩa Axios response chứa: data: VerifyResponse
        // Tức: response.data -> có kiểu: VerifyResponse và response.data.user -> Có kiểu: User

        try {
            const response = await api.get<VerifyResponse>( // api.get<VerifyResponse>() API này trả về data có cấu trúc VerifyResponse.
                "/users/verify",
                {
                    withCredentials: true, // Nếu authentication của bạn sử dụng cookie, browser sẽ gửi cookie cùng request.
                    // -> cho phép request gửi cookie đó lên backend.
                }
            );

            return response;
        } catch (error) {
            window.location.href = "/login";
            throw error;
        }
    },
};

export default Auth;