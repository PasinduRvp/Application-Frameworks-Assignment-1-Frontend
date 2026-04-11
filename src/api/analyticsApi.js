import axios from './axios';

export const analyticsApi = {
  getEmissionStatistics: async (params) => {
    const response = await axios.get('/analytics/emissions', { params });
    return response.data;
  },

  getFuelSavings: async () => {
    const response = await axios.get('/analytics/fuel-savings');
    return response.data;
  },

  getEnvironmentalImpact: async (vesselId, period) => {
    const response = await axios.get(
      `/analytics/environmental-impact/${vesselId}`,
      { params: { period } }
    );
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await axios.get('/analytics/dashboard');
    return response.data;
  },

  recordViolation: async (violationData) => {
    const response = await axios.post('/analytics/violations', violationData);
    return response.data;
  },
};