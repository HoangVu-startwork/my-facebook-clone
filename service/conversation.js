// import api from "../api/api";

// let conversationCache = null;
// let conversationPromise = null;


// const Conversation = {

//     getConversation: async () => {
//         try {
//             const response = await api.get(`/conversation`, {withCredentials: true});
//             console.log(response)
//             return response;
//         } catch (error) {
//             throw error.response?.data || error;
//         }
//     }

// }

// export default Conversation;

import api from "../api/api";

const Conversation = {
    getConversation() {
        return api.get("/conversation", {
            withCredentials: true,
        });
    },
};

export default Conversation;