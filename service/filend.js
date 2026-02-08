import api from "../api/api";

const Filend = {
    postFilend: async (selectedUser, message) => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.post(`/ketban/send`, {
                sdt: selectedUser,
                message: message,
            }, config)
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Chấp nhận lời mời
    putFilendAccept: async (id) => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.put(`/ketban/accept/${id}`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Từ chối lời mời
    putFilendReject: async (id) => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.put(`/ketban/reject/${id}`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
    // Xoá lời mời kết bạn
    putDeleteFilendReject: async (id) => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.delete(`/ketban/requests/${id}`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getReceivePending: async () => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            const response = await api.get(`/ketban/receiverpending`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getFilend: async () => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.post(`/ketban/send`, config)
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserfilend: async () => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            const response = await api.get(`/ketban/strangers`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserPending: async () => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            const response = await api.get(`/ketban/pending`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserFriends: async () => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            const response = await api.get(`/ketban/friends`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserBlocked: async () => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            const response = await api.get(`/ketban/blocked`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserRejected: async () => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            const response = await api.get(`/ketban/rejected`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserAccepted: async () => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            const response = await api.get(`/ketban/accepted`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
}

export default Filend;