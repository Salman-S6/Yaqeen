import api from './axios';

export const authService = {
    login: (credentials) => api.post('auth/login', credentials),

    getProfile: () => api.get('auth/me'),

    logout: () => api.post('auth/logout')
};