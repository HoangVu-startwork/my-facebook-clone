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

    gettoken: async () => {
        try {
            if (verified) return;
            verified = true;
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.get(`/users/verify`, config)
            return response;
        } catch (error) {
            window.location.href = "/login";
            throw error.response?.data || error;
        }
    },

    postIntroduceEducation: async () => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
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
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.get(`/educations/${userId}`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
}


export default Auth;