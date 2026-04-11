import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vesselApi } from '../../api/vesselApi';
import { toast } from 'react-toastify';

export const fetchVessels = createAsyncThunk(
  'vessels/fetchVessels',
  async (params, { rejectWithValue }) => {
    try {
      const response = await vesselApi.getAllVessels(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createVessel = createAsyncThunk(
  'vessels/createVessel',
  async (vesselData, { rejectWithValue }) => {
    try {
      const response = await vesselApi.createVessel(vesselData);
      toast.success('Vessel created successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create vessel');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateVessel = createAsyncThunk(
  'vessels/updateVessel',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await vesselApi.updateVessel(id, data);
      toast.success('Vessel updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update vessel');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteVessel = createAsyncThunk(
  'vessels/deleteVessel',
  async (id, { rejectWithValue }) => {
    try {
      await vesselApi.deleteVessel(id);
      toast.success('Vessel deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete vessel');
      return rejectWithValue(error.response?.data);
    }
  }
);

const vesselSlice = createSlice({
  name: 'vessels',
  initialState: {
    vessels: [],
    currentVessel: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentVessel: (state, action) => {
      state.currentVessel = action.payload;
    },
    clearCurrentVessel: (state) => {
      state.currentVessel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vessels
      .addCase(fetchVessels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVessels.fulfilled, (state, action) => {
        state.loading = false;
        state.vessels = action.payload.vessels;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVessels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Vessel
      .addCase(createVessel.fulfilled, (state, action) => {
        state.vessels.unshift(action.payload);
      })
      // Update Vessel
      .addCase(updateVessel.fulfilled, (state, action) => {
        const index = state.vessels.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) {
          state.vessels[index] = action.payload;
        }
      })
      // Delete Vessel
      .addCase(deleteVessel.fulfilled, (state, action) => {
        state.vessels = state.vessels.filter((v) => v._id !== action.payload);
      });
  },
});

export const { setCurrentVessel, clearCurrentVessel } = vesselSlice.actions;
export default vesselSlice.reducer;