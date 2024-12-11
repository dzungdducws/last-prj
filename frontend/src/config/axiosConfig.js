import axios from "axios";

// Tạo instance Axios
const api = axios.create({
  baseURL: "http://localhost:8004",
});

// Thêm interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
