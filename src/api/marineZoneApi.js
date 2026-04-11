import axios from './axios';

export const marineZoneApi = {
  getAllZones: async (params) => {
    const response = await axios.get('/marine-zones', { params });
    return response.data;
  },

  getZoneById: async (id) => {
    const response = await axios.get(`/marine-zones/${id}`);
    return response.data;
  },

  createZone: async (zoneData) => {
    const response = await axios.post('/marine-zones', zoneData);
    return response.data;
  },

  updateZone: async (id, zoneData) => {
    const response = await axios.put(`/marine-zones/${id}`, zoneData);
    return response.data;
  },

  deleteZone: async (id) => {
    const response = await axios.delete(`/marine-zones/${id}`);
    return response.data;
  },

  checkRouteIntersection: async (coordinates) => {
    const response = await axios.post('/marine-zones/check-route', {
      coordinates,
    });
    return response.data;
  },

  getZoneStatistics: async () => {
    const response = await axios.get('/marine-zones/statistics');
    return response.data;
  },
};