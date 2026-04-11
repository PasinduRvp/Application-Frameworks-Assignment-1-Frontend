import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { routeApi } from '../../api/routeApi';
import { toast } from 'react-toastify';

export const previewRoute = createAsyncThunk(
  'routes/previewRoute',
  async (routeData, { rejectWithValue }) => {
    try {
      const response = await routeApi.previewRoute(routeData);
      const warnings = response.data.warnings || [];
      if (warnings.length > 0) {
        toast.warning(`Environmental Warning: Route intersects with ${warnings.length} protected area(s)!`, {
          autoClose: 5000,
          icon: '⚠️'
        });
      } else {
        toast.info('Route metrics calculated for preview');
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to calculate route preview');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const calculateRoute = createAsyncThunk(
  'routes/calculateRoute',
  async (routeData, { rejectWithValue }) => {
    try {
      const response = await routeApi.calculateRoute(routeData);
      toast.success('Route confirmed and saved successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save route');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchRoutes = createAsyncThunk(
  'routes/fetchRoutes',
  async (params, { rejectWithValue }) => {
    try {
      const response = await routeApi.getAllRoutes(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteRoute = createAsyncThunk(
  'routes/deleteRoute',
  async (id, { rejectWithValue }) => {
    try {
      await routeApi.deleteRoute(id);
      toast.success('Route deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete route');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchRouteById = createAsyncThunk(
  'routes/fetchRouteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await routeApi.getRouteById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateRouteStatus = createAsyncThunk(
  'routes/updateRouteStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await routeApi.updateRouteStatus(id, status);

      if (status === 'completed' && response.data.protectedAreasAvoided?.length > 0) {
        toast.warning(`Voyage completed, but ${response.data.protectedAreasAvoided.length} environmental infractions were recorded. Check Analytics for details.`, {
          autoClose: 10000
        });
      } else {
        toast.success(`Route status updated to ${status.replace('_', ' ')}`);
      }

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update route status');
      return rejectWithValue(error.response?.data);
    }
  }
);

const routeSlice = createSlice({
  name: 'routes',
  initialState: {
    routes: [],
    currentRoute: null,
    calculatedRoute: null,
    warnings: [],
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
    clearCurrentRoute: (state) => {
      state.currentRoute = null;
    },
    clearCalculatedRoute: (state) => {
      state.calculatedRoute = null;
      state.warnings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Preview Route completes with warnings
      .addCase(previewRoute.pending, (state) => {
        state.loading = true;
      })
      .addCase(previewRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.calculatedRoute = action.payload.preview;
        state.warnings = action.payload.warnings || [];
      })
      .addCase(previewRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Calculate (Confirm/Save) Route with details
      .addCase(calculateRoute.pending, (state) => {
        state.loading = true;
      })
      .addCase(calculateRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoute = action.payload;
        state.calculatedRoute = null; 
        state.warnings = [];
      })
      .addCase(calculateRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload.routes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteRoute.fulfilled, (state, action) => {
        state.routes = state.routes.filter((r) => r._id !== action.payload);
      })
      // Fetch Route By ID
      .addCase(fetchRouteById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRouteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoute = action.payload;
      })
      .addCase(fetchRouteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRouteStatus.fulfilled, (state, action) => {
        state.currentRoute = action.payload;
        // Also update in the main routes list if found with matching ID
        const index = state.routes.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.routes[index] = action.payload;
        }
      });
  },
});

export const { setCurrentRoute, clearCurrentRoute, clearCalculatedRoute } =
  routeSlice.actions;
export default routeSlice.reducer;