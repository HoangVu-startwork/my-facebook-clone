import api from "../api/api";

let conversationCache = null;
let conversationPromise = null;


const Conversation = {

    getConversations: async () => {
        // Nếu đã có cache -> trả luôn
        if (conversationCache) {
            return conversationCache;
        }

        // Nếu đang fetch -> trả promise đang chờ
        if (conversationPromise) {
            return conversationPromise;
        }

        const token = window.localStorage.getItem("token");
        const config = {};

        if (token) {
            config.headers = { Authorization: `Bearer ${token}` };
        }

        conversationPromise = api.get("/conversation", config)
            .then(res => {
                conversationCache = res;
                return res;
            })
            .finally(() => {
                conversationPromise = null;
            });

        return conversationPromise;
    },

    clearCache: () => {
        conversationCache = null;
    },

    getConversation: async () => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.get(`/conversation`, config);
            console.log(response)
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

}

export default Conversation;