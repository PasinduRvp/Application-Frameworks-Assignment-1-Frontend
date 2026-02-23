import axios from './axios';

export const vesselApi = {
  getAllVessels: async (params) => {
    const response = await axios.get('/vessels', { params });
    return response.data;
  },

  getVesselById: async (id) => {
    const response = await axios.get(`/vessels/${id}`);
    return response.data;
  },

  createVessel: async (vesselData) => {
    const response = await axios.post('/vessels', vesselData);
    return response.data;
  },

  updateVessel: async (id, vesselData) => {
    const response = await axios.put(`/vessels/${id}`, vesselData);
    return response.data;
  },

  deleteVessel: async (id) => {
    const response = await axios.delete(`/vessels/${id}`);
    return response.data;
  },

  getMyVessels: async () => {
    const response = await axios.get('/vessels/owner/me');
    return response.data;
  },

  getVesselStatistics: async () => {
    const response = await axios.get('/vessels/statistics');
    return response.data;
  },
};