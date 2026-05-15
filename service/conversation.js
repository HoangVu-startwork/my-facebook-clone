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

        conversationPromise = api.get("/conversation", {withCredentials: true})
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
            const response = await api.get(`/conversation`, {withCredentials: true});
            console.log(response)
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

}

export default Conversation;