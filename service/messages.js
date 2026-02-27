import api from "../api/api";
/**
 * @param {{
*  receiverId: number,
*  content?: string,
*  contentType?: string,
*  file?: File | null,
*  replyToId?: number | null
* }} params
*/
const Messages = {
    reactMessages: async (params) => {
        try {
            const {
                receiverId,
                content = "",
                file,
                replyToId
            } = params;
            const formData = new FormData();

            formData.append("receiverId", String(receiverId));
            formData.append("content", content);

            if (replyToId) {
                formData.append("replyToId", String(replyToId));
            }

            if (file instanceof File) {
                formData.append("file", file);
            }


            const token = window.localStorage.getItem("token");

            const config = {}
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.post(`/message/sendimg`, formData, config);

            console.log(response)
            return response;
        } catch (error) {

        }
    },

    getMessages: async (conversationId) => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.get(`/message/getblock/${conversationId}`, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    putMessagesXem: async (conversationId, lastMessageId) => {
        try {
            const token = window.localStorage.getItem("token");
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await api.put(`/message/mark-read`, {conversationId, lastMessageId}, config);
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }

    }
}

export default Messages;