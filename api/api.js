import axios from "axios";

// Create initial axios instance without Authorization header
const apiHost = process.env.NEXT_PUBLIC_API_HOST.replace(/^https?:\/\//, '');


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST.replace('https', 'http'),
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp; // exp dạng UNIX time (seconds)
    const now = Math.floor(Date.now() / 1000);

    return exp < now; // true = hết hạn
  } catch (e) {
    return true;
  }
}
api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");

  if (token) {
    if (isTokenExpired(token)) {
      window.localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject("Token expired");
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🔥 QUAN TRỌNG NHẤT
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// api.interceptors.request.use(
//   (config) => {
//     const token = window.localStorage.getItem("token");

//     if (token) {
//       if (isTokenExpired(token)) {
//         console.log("Token expired. Redirecting to login.");

//         window.localStorage.removeItem("token");
//         window.location.href = "/login"; // redirect

//         return Promise.reject("Token expired");
//       }

//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// Interceptor RESPONSE — xử lý lỗi 401 (nếu server trả về)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized 401 → Redirecting to login...");
      window.localStorage.removeItem("token");
      //window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default api;

// api.interceptors.response.use(
//   response => response, // Return response if no error
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Remove token from localStorage
//       // window.localStorage.removeItem("token");
//       // Optionally redirect to the login page
//       console.log("Token expired. Redirecting to login."); // Adjust the path as needed
//     }
//     return Promise.reject(error);
//   }
// );