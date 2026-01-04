import axios from 'axios';

// Production backend URL on Render
// Frontend: https://vote-1-2pap.onrender.com
// Backend: https://vote-5upq.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vote-5upq.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { API_BASE_URL, api };
