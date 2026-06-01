import api from './axios';

export const employeeService = {
    // إحصائيات وسجلات
    getAdminStats: () => api.get('admin/stats'),
    getVerificationLogs: () => api.get('admin/verification-logs'),
    getPerformanceDashboard: () => api.get('admin/dashboard'),
    getOcrLogs: () => api.get('admin/ocr-logs'),
    
    // مسار سجلات التدقيق
    getAuditLogs: () => api.get('admin/audit-logs'),
    
    // مسارات إدارة المواطنين
    getCitizens: () => api.get('admin/citizens'),
    getCitizenDetails: (id) => api.get(`admin/citizens/${id}`),
    toggleCitizenStatus: (id) => api.patch(`admin/citizens/${id}/toggle-status`),
    
    // مسارات إدارة الموظفين
    getAllRequests: () => api.get('requests'),
    getAll: () => api.get('admin/employees'),
    create: (payload) => api.post('admin/employees', payload),
    update: (id, payload) => api.put(`admin/employees/${id}`, payload),
    delete: (id) => api.delete(`admin/employees/${id}`),

    // 🟢 مسارات إدارة صلاحيات الموظفين الجديدة
    getEmployeePermissions: (id) => api.get(`admin/employees/${id}/permissions`),
    updateEmployeePermissions: (id, permissions) => api.put(`admin/employees/${id}/permissions`, { permissions }),
};