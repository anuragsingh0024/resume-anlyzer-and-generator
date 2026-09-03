import axios from "axios";
import { toast } from "react-hot-toast";


let rawBaseUrl = import.meta.env.VITE_BASE_URL || "https://resume-anlyzer-and-generator-1.onrender.com/api/v1";
rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');
if (!rawBaseUrl.endsWith('/api/v1')) {
    rawBaseUrl = `${rawBaseUrl}/api/v1`;
}
const BASE_URL = rawBaseUrl;

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Request interceptor for auth headers & offline check
axiosInstance.interceptors.request.use(
    (config) => {
        if (!navigator.onLine) {
            toast.error("No Internet Connection! Please check your network.");
            return Promise.reject(new Error("No Internet Connection"));
        }

        // Attach JWT token if available
        let token = localStorage.getItem("token");
        if (token) {
            // Clean up any json-stringified quotes
            if (token.startsWith('"') && token.endsWith('"')) {
                token = token.slice(1, -1);
            }
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle offline errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!navigator.onLine) {
            toast.error("You are offline! Check your internet connection.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
