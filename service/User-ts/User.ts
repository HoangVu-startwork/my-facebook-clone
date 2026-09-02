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
        try {
            const response = await api.get<VerifyResponse>(
                "/users/verify",
                {
                    withCredentials: true,
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