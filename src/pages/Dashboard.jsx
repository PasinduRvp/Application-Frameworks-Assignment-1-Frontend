import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../redux/slices/analyticsSlice';
import { fetchRoutes } from '../redux/slices/routeSlice';
import DashboardStats from '../components/dashboard/DashboardStats';
import EmissionChart from '../components/dashboard/EmissionChart';
import RecentRoutes from '../components/dashboard/RecentRoutes';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { dashboardStats, loading } = useSelector((state) => state.analytics);
  const { routes } = useSelector((state) => state.routes);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRoutes({ limit: 5 }));
  }, [dispatch]);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-ocean-600 to-ocean-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-ocean-100">
          Here's an overview of your maritime navigation activities
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={dashboardStats?.last30Days} />

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmissionChart data={dashboardStats?.trends} />
        <RecentRoutes routes={routes} />
      </div>
    </div>
  );
};

export default Dashboard;