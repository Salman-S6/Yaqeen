import api from './axios'; // استدعاء نسخة الأكسيوس المركزية المحمية بالتوكن

export const employeeRequestService = {
    // 🟢 جلب كافة الطلبات المعلقة (GET /api/requests)
    getPendingRequests: () => api.get('requests'),
    
    // 🟢 مراجعة وسحب طلب محدد لبدء التدقيق الرقمي (GET /api/requests/{id})
    reviewRequest: (id) => api.get(`requests/${id}`)
};