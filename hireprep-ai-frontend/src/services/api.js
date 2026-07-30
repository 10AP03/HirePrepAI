import axios from "axios";


const api = axios.create({              // reusable Axios instance

    baseURL: "http://localhost:5000/api",

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,           // Allows cookies 
});

api.interceptors.request.use(         // Attach JWT Token Automatically

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