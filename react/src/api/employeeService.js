import api from './axios';

export const employeeService = {
    // 🟢 إضافة مسار جلب بيانات لوحة تحكم أداء الموظفين
    getPerformanceDashboard: () => api.get('admin/dashboard'),

    // مسارات إدارة الموظفين الحالية
    getAll: () => api.get('admin/employees'),
    create: (payload) => api.post('admin/employees', payload),
    update: (id, payload) => api.put(`admin/employees/${id}`, payload),
    delete: (id) => api.delete(`admin/employees/${id}`),
};