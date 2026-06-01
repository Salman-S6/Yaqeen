import api from './axios'; 

export const employeeRequestService = {
    getDashboardData: () => api.get('employee/dashboard'),

    getPendingRequests: () => api.get('requests'),
    
    reviewRequest: (id) => api.get(`requests/${id}`),

    approveRequest: (id) => api.post(`requests/${id}/approve`),

    rejectRequest: (id, reason) => api.post(`requests/${id}/reject`, { reason })
};