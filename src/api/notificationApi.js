import axios from './axios';

export const notificationApi = {
    getNotifications: async () => {
        const response = await axios.get('/notifications');
        return response.data;
    },
    markAsRead: async (id) => {
        const response = await axios.put(`/notifications/${id}/read`);
        return response.data;
    },
    deleteNotification: async (id) => {
        const response = await axios.delete(`/notifications/${id}`);
        return response.data;
    }
};
