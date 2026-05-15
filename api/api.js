import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST.replace('https', 'http'),
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