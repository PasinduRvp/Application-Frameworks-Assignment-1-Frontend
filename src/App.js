import { io } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import { fetchMarineZones } from './redux/slices/marineZoneSlice';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './redux/store';
import { addNotification } from './redux/slices/notificationSlice';


// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import VesselsPage from './pages/VesselsPage';
import MarineZonesPage from './pages/MarineZonesPage';
import RoutesPage from './pages/RoutesPage';
import RouteDetailsPage from './pages/RouteDetailsPage';
import RoutePlannerPage from './pages/RoutePlannerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

function App() {
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const socketUrl = apiUrl.replace(/\/api$/, '');

    console.log('📡 Connecting to socket at:', socketUrl);

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('🔌 Connected to signaling server');
    });

    socket.on('emergency_zone_created', (data) => {
      toast.error(`🚨 EMERGENCY: ${data.notification.message}`, {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Notify components about new notification via Redux
      store.dispatch(addNotification(data.notification));

      // Refresh marine zones to update map
      store.dispatch(fetchMarineZones());
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </Provider>
  );
}

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vessels" element={<VesselsPage />} />
          <Route path="/marine-zones" element={<MarineZonesPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:id" element={<RouteDetailsPage />} />
          <Route path="/route-planner" element={<RoutePlannerPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;