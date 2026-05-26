import api from './axios';

export const serviceTypeService = {
    getAll: () => api.get('service-types'),
    create: (payload) => api.post('service-types', payload),
    update: (id, payload) => api.put(`service-types/${id}`, payload),
    delete: (id) => api.delete(`service-types/${id}`),
};