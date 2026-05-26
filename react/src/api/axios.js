import axios from 'axios';

// إنشاء نسخة مخصصة من Axios
const api = axios.create({
    // نضمن أن الرابط ينتهي بـ / لتجنب مشاكل الدمج
    baseURL: import.meta.env.VITE_API_BASE_URL.endsWith('/')
        ? import.meta.env.VITE_API_BASE_URL
        : `${import.meta.env.VITE_API_BASE_URL}/`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // ✅ التعديل هنا: تخطي صفحة التحذير الخاصة بـ Microsoft Dev Tunnels
        'X-Tunnel-Skip-Anti-Phishing-Page': 'true',
        // يمكنك إبقاء هيدر ngrok احتياطاً لو عاد زميلك لاستخدامه
        'ngrok-skip-browser-warning': 'true'
    }
});

// إضافة "اعتراض" (Interceptor) لإضافة التوكن تلقائياً
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;