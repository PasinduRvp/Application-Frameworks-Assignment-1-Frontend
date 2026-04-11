import axios from './axios';


export const routeApi = {
  previewRoute: async (routeData) => {
    const response = await axios.post('/routes/preview', routeData);
    return response.data;
  },

// Calculate (Confirm/Save) Route with details
  calculateRoute: async (routeData) => {
    const response = await axios.post('/routes/calculate', routeData);
    return response.data;
  },

// Fetch Routes with optional filters
  getAllRoutes: async (params) => {
    const response = await axios.get('/routes', { params });
    return response.data;
  },

// Fetch single route by ID
  getRouteById: async (id) => {
    const response = await axios.get(`/routes/${id}`);
    return response.data;
  },

// Update route status (e.g., mark as completed)
  updateRouteStatus: async (id, status) => {
    const response = await axios.put(`/routes/${id}/status`, { status });
    return response.data;
  },

//delete route by ID
  deleteRoute: async (id) => {
    const response = await axios.delete(`/routes/${id}`);
    return response.data;
  },
// Get route statistics for dashboard
  getRouteStatistics: async () => {
    const response = await axios.get('/routes/statistics');
    return response.data;
  },
};