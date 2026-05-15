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

            const response = await api.post(`/message/sendimg`, formData, {withCredentials: true});

            console.log(response)
            return response;
        } catch (error) {

        }
    },

    getMessages: async (conversationId) => {
        try {
            const response = await api.get(`/message/getblock/${conversationId}`, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    putMessagesXem: async (conversationId, lastMessageId) => {
        try {
            const response = await api.put(`/message/mark-read`, {conversationId, lastMessageId}, {withCredentials: true});
            return response;
        } catch (error) {
            throw error.response?.data || error;
        }

    }
}

export default Messages;