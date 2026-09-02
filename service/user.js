import api from "../api/api";

let verified = false;

const Auth = {

    singup: async (email, username, phone, gender, password, isDateValids) => {
        try {
            const response = await api.post(`/users/register`, {
                username: username,
                email: email,
                sdt: phone,
                giotinh: gender,
                ngaysinh: isDateValids,
                password
            })
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    login: async (identifier, password) => {
        try {
            const response = await api.post(`/users/login`, {
                identifier: identifier,
                password
            })
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // đăng xuất tài khoản
    logout: async () => {
        try {
            const response = await api.post(`/users/logout`);
            // Sau khi server xóa cookie thành công, chuyển hướng về trang login
            window.location.href = "/login";
            return response;
        } catch (error) {
            // Ngay cả khi lỗi, thông thường vẫn nên đẩy user về trang login
            window.location.href = "/login";
            throw error.response?.data || error;
        }
    },

    gettoken: async () => {
        try {
            const response = await api.get(`/users/verify`, {withCredentials: true})
            return response;
        } catch (error) {
            window.location.href = "/login";
            throw error;
        }
    },

    postIntroduceEducation: async () => {
        try {
            const response = await api.post(`/education`, {
                username: username,
                email: email,
                sdt: phone,
                giotinh: gender,
                ngaysinh: isDateValids,
                password
            }, config)
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getIntroduce: async (userId) => {
        try {
            const response = await api.get(`/educations/${userId}`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    putuploadavatUrlfacebook: async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatUrlfacebook', file);

            const response = await api.put(`/users/avatUrlfacebook`, formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
}


export default Auth;