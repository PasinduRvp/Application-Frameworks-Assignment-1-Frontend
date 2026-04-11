import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsApi } from '../../api/analyticsApi';

export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchEmissionStats = createAsyncThunk(
  'analytics/fetchEmissionStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getEmissionStatistics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchFuelSavings = createAsyncThunk(
  'analytics/fetchFuelSavings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getFuelSavings();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    dashboardStats: null,
    emissionStats: null,
    fuelSavings: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmissionStats.fulfilled, (state, action) => {
        state.emissionStats = action.payload;
      })
      .addCase(fetchFuelSavings.fulfilled, (state, action) => {
        state.fuelSavings = action.payload;
      });
  },
});

export default analyticsSlice.reducer;