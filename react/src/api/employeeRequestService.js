import api from './axios'; // استدعاء نسخة الأكسيوس المركزية المحمية بالتوكن

export const employeeRequestService = {
    // 🟢 جلب إحصائيات لوحة التحكم
    getDashboardData: () => api.get('employee/dashboard'),

    // 🟢 جلب كافة الطلبات المعلقة
    getPendingRequests: () => api.get('requests'),
    
    // 🟢 مراجعة وسحب طلب محدد لبدء التدقيق
    reviewRequest: (id) => api.get(`requests/${id}`),

    // ✅ قبول واعتماد الطلب
    approveRequest: (id) => api.post(`requests/${id}/approve`),

    // ❌ رفض الطلب مع إرسال السبب
    rejectRequest: (id, reason) => api.post(`requests/${id}/reject`, { reason })
};