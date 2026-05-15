import api from "../api/api";

let reactionFetched = false;   // đã gọi chưa
let reactionCache = null;      // lưu data

const Reaction = {
    getReaction: async () => {
        try {
            if (reactionFetched) {
                console.log("📦 Reaction từ cache");
                return reactionCache;
            }

            reactionFetched = true;

            const response = await api.get(`/post/reactions`, {withCredentials: true})
            reactionCache = response.data.data; // lưu cache
            return reactionCache;

        } catch (error) {
            reactionFetched = false; // lỗi cho gọi lại
            throw error.response?.data || error;
        }
    },

    resetReaction: () => {
        reactionFetched = false;
        reactionCache = null;
    },

    reactPost: async ({postId, reactionCode}) => {
        try {
            console.log(postId, reactionCode);
            const response = await api.post(`/posts/react`, {postId, reactionCode}, {withCredentials: true})
            return response;
        } catch (error) {

        }
    },
}

export default Reaction;