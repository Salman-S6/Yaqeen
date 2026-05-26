import api from './axios';

export const authService = {
    // تسجيل الدخول
    // سيطلب: /api/auth/login
    login: (credentials) => api.post('auth/login', credentials), 
    
    // جلب البيانات الشخصية
    // سيطلب: /api/auth/me
    getProfile: () => api.get('auth/me'), 
    
    // تسجيل الخروج
    // سيطلب: /api/auth/logout
    logout: () => api.post('auth/logout'),
};