import api from "../api/api";

const Filend = {
    postFilend: async (selectedUser, message) => {
        try {
            const response = await api.post(`/ketban/send`, {
                sdt: selectedUser,
                message: message,
            }, {withCredentials: true})
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Chấp nhận lời mời
    putFilendAccept: async (id) => {
        try {
            const response = await api.put(`/ketban/accept/${id}`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Từ chối lời mời
    putFilendReject: async (id) => {
        try {
            const response = await api.put(`/ketban/reject/${id}`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
    // Xoá lời mời kết bạn
    putDeleteFilendReject: async (id) => {
        try {
            const response = await api.delete(`/ketban/requests/${id}`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getReceivePending: async () => {
        try {
            const response = await api.get(`/ketban/receiverpending`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getFilend: async () => {
        try {
            const response = await api.post(`/ketban/send`, {withCredentials: true})
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserfilend: async () => {
        try {
            const response = await api.get(`/ketban/strangers`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserPending: async () => {
        try {
            const response = await api.get(`/ketban/pending`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserFriends: async () => {
        try {
            const response = await api.get(`/ketban/friends`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserBlocked: async () => {
        try {
            const response = await api.get(`/ketban/blocked`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserRejected: async () => {
        try {
            const response = await api.get(`/ketban/rejected`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserAccepted: async () => {
        try {
            const response = await api.get(`/ketban/accepted`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
}

export default Filend;