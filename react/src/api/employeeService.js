import api from './axios';

export const employeeService = {
    // إحصائيات وسجلات
    getAdminStats: () => api.get('admin/stats'),
    getVerificationLogs: () => api.get('admin/verification-logs'),
    getPerformanceDashboard: () => api.get('admin/dashboard'),
    
    // 🟢 المسار الجديد المربوط بـ API الخاص بك
    getOcrLogs: () => api.get('admin/ocr-logs'),
    
    getAllRequests: () => api.get('requests'),
    getAll: () => api.get('admin/employees'),
    create: (payload) => api.post('admin/employees', payload),
    update: (id, payload) => api.put(`admin/employees/${id}`, payload),
    delete: (id) => api.delete(`admin/employees/${id}`),
};