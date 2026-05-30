import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const normalizedBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

const api = axios.create({
    baseURL: normalizedBaseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Tunnel-Skip-Anti-Phishing-Page': 'true',
        'ngrok-skip-browser-warning': 'true'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
