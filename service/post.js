import api from "../api/api";

let postFetched = false;              // feed đã load chưa
let viewedPosts = new Set();          // các post đã tăng view

const Post = {
    Thembaipost: async (content, file, backgroundColor) => {
        try {
            const token = window.localStorage.getItem("token");
            let body;
            const config = {}
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            console.log(file);
            if (file) {
                body = new FormData();
                body.append("content", content);
                body.append("file", file); // file upload
                if (backgroundColor) body.append("backgroundColor", backgroundColor);
            } else {
                // Nếu chọn màu → gửi JSON
                body = {
                    content,
                    backgroundColor: backgroundColor || null
                };
            }
            // Gửi request
            const response = await api.post(`/postsfb`, body, config);

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
            const token = window.localStorage.getItem("token");

            const config = {}
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            const response = await api.post(`/post/view/${postId}`, config)
            return response;
        } catch (error) {

        }
    },

    getPost: async (page, limit, seed) => {
        try {
            
            const token = window.localStorage.getItem("token");

            const config = {}
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            const response = await api.get(`/post1/postfbuser?page=${page}&limit=${limit}&seed=${seed}`, config)
            return response;
        } catch (error) {

        }
    }
}

export default Post;