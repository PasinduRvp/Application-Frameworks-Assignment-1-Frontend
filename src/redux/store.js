import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vesselReducer from './slices/vesselSlice';
import marineZoneReducer from './slices/marineZoneSlice';
import routeReducer from './slices/routeSlice';
import analyticsReducer from './slices/analyticsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vessels: vesselReducer,
    marineZones: marineZoneReducer,
    routes: routeReducer,
    analytics: analyticsReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});