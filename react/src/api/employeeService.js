import api from './axios';

export const employeeService = {
    // 🟢 إضافة مسار جلب سجلات التحقق الخارجي
    getVerificationLogs: () => api.get('admin/verification-logs'),

    getPerformanceDashboard: () => api.get('admin/dashboard'),
    getAll: () => api.get('admin/employees'),
    create: (payload) => api.post('admin/employees', payload),
    update: (id, payload) => api.put(`admin/employees/${id}`, payload),
    delete: (id) => api.delete(`admin/employees/${id}`),
};