import axios from "axios";

const api = axios.create({

    // Production backend API
    baseURL: "https://hireprepai.onrender.com/api",

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,
});

api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)

);

export default api;