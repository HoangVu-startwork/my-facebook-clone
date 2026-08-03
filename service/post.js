import api from "../api/api";

let postFetched = false;              // feed đã load chưa
let viewedPosts = new Set();          // các post đã tăng view

const Post = {
    Thembaipost: async (content, file, backgroundColor, privacy, userList) => {
        try {
            const body = new FormData();

            body.append("content", content);
    
            if (file) {
                body.append("file", file);
            }
    
            if (backgroundColor) {
                body.append("backgroundColor", backgroundColor);
            }
    
            body.append("privacy", privacy);
            body.append("userList", JSON.stringify(userList));

            console.log(body)
            // Gửi request
            const response = await api.post(`/postsfb`, body, {withCredentials: true});

            return response;
        } catch (error) {
            if (error.response) {
                throw error.response.data;
            }
            throw new Error("Lỗi gọi API đăng bài");
        }
    },

    // /post/view/:postId
    viewPost: async (postId, element) => {
        try {
            const response = await api.post(`/post/view/${postId}`, {withCredentials: true})
            return response;
        } catch (error) {

        }
    },

    getPost: async (page, limit, seed) => {
        try {
            const response = await api.get(`/post1/postfbuser?page=${page}&limit=${limit}&seed=${seed}`, {withCredentials: true})
            return response;
        } catch (error) {

        }
    }
}

export default Post;