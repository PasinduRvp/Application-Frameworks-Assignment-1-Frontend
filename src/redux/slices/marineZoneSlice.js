import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { marineZoneApi } from '../../api/marineZoneApi';
import { toast } from 'react-toastify';

export const fetchMarineZones = createAsyncThunk(
  'marineZones/fetchMarineZones',
  async (params, { rejectWithValue }) => {
    try {
      const response = await marineZoneApi.getAllZones(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createMarineZone = createAsyncThunk(
  'marineZones/createMarineZone',
  async (zoneData, { rejectWithValue }) => {
    try {
      const response = await marineZoneApi.createZone(zoneData);
      toast.success('Marine zone created successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create zone');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateMarineZone = createAsyncThunk(
  'marineZones/updateMarineZone',
  async ({ id, zoneData }, { rejectWithValue }) => {
    try {
      const response = await marineZoneApi.updateZone(id, zoneData);
      toast.success('Marine zone updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update zone');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteMarineZone = createAsyncThunk(
  'marineZones/deleteMarineZone',
  async (id, { rejectWithValue }) => {
    try {
      await marineZoneApi.deleteZone(id);
      toast.success('Marine zone deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete zone');
      return rejectWithValue(error.response?.data);
    }
  }
);

const marineZoneSlice = createSlice({
  name: 'marineZones',
  initialState: {
    zones: [],
    currentZone: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentZone: (state, action) => {
      state.currentZone = action.payload;
    },
    clearCurrentZone: (state) => {
      state.currentZone = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarineZones.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMarineZones.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = action.payload.zones;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMarineZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMarineZone.fulfilled, (state, action) => {
        state.zones.unshift(action.payload);
      })
      .addCase(updateMarineZone.fulfilled, (state, action) => {
        const index = state.zones.findIndex((z) => z._id === action.payload._id);
        if (index !== -1) {
          state.zones[index] = action.payload;
        }
      })
      .addCase(deleteMarineZone.fulfilled, (state, action) => {
        state.zones = state.zones.filter((z) => z._id !== action.payload);
      });
  },
});

export const { setCurrentZone, clearCurrentZone } = marineZoneSlice.actions;
export default marineZoneSlice.reducer;