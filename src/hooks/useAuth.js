import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const isAdmin = user?.role === 'admin';
  const isFleetManager = user?.role === 'fleet_manager';
  const isShipCaptain = user?.role === 'ship_captain';
  const isEnvironmentalOfficer = user?.role === 'environmental_officer';

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin,
    isFleetManager,
    isShipCaptain,
    isEnvironmentalOfficer,
  };
};