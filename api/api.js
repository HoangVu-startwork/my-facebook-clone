import axios from "axios";

// 1. Lấy giá trị biến môi trường, nếu không có thì mặc định là chuỗi rỗng ''
const apiHost = 'https://webpostsend.click/api/api';

const api = axios.create({
  // 2. Gọi .replace() an toàn sau khi đã chắc chắn nó là một chuỗi
  baseURL: 'https://webpostsend.click/api/api',
  withCredentials: true // 🔥 Quan trọng: cho phép gửi cookie
});

// REQUEST interceptor
api.interceptors.request.use((config) => {

  // 🔥 Nếu gửi FormData thì bỏ Content-Type
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// RESPONSE interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {
      console.log("Unauthorized → Redirecting to login");

      // Không còn localStorage nữa
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;