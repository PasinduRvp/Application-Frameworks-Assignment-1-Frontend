import axios from './axios';

export const routeApi = {
  previewRoute: async (routeData) => {
    const response = await axios.post('/routes/preview', routeData);
    return response.data;
  },

  calculateRoute: async (routeData) => {
    const response = await axios.post('/routes/calculate', routeData);
    return response.data;
  },

  getAllRoutes: async (params) => {
    const response = await axios.get('/routes', { params });
    return response.data;
  },

  getRouteById: async (id) => {
    const response = await axios.get(`/routes/${id}`);
    return response.data;
  },

  updateRouteStatus: async (id, status) => {
    const response = await axios.put(`/routes/${id}/status`, { status });
    return response.data;
  },

  deleteRoute: async (id) => {
    const response = await axios.delete(`/routes/${id}`);
    return response.data;
  },

  getRouteStatistics: async () => {
    const response = await axios.get('/routes/statistics');
    return response.data;
  },
};