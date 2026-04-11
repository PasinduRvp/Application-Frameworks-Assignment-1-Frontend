import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Ship, User, LogOut, Menu, X, ShieldCheck, Bell } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import { useAuth } from '../../hooks/useAuth';
import NotificationDrawer from './NotificationDrawer';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-ocean-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Ship className="text-white" size={32} />
              <span className="text-white text-xl font-bold">EcoNav</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-ocean-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/vessels"
                  className="text-white hover:text-ocean-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Vessels
                </Link>
                <Link
                  to="/marine-zones"
                  className="text-white hover:text-ocean-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Marine Zones
                </Link>
                <Link
                  to="/routes"
                  className="text-white hover:text-ocean-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Routes
                </Link>
                <Link
                  to="/analytics"
                  className="text-white hover:text-ocean-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Analytics
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 bg-white/10 text-white hover:bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  >
                    <ShieldCheck size={18} className="text-amber-400" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* Notifications Bell */}
                <button
                  onClick={() => setIsNotificationOpen(true)}
                  className="p-2 text-white hover:bg-ocean-500 rounded-full transition-colors relative mr-2"
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-ocean-600 animate-pulse"></span>
                  )}
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-3 ml-4 border-l border-ocean-500 pl-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-white hover:text-ocean-100 transition-colors"
                  >
                    <User size={20} />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-white hover:text-ocean-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-ocean-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && isAuthenticated && (
        <div className="md:hidden bg-ocean-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="text-white hover:text-ocean-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/vessels"
              className="text-white hover:text-ocean-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Vessels
            </Link>
            <Link
              to="/marine-zones"
              className="text-white hover:text-ocean-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Marine Zones
            </Link>
            <Link
              to="/routes"
              className="text-white hover:text-ocean-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              to="/profile"
              className="text-white hover:text-ocean-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-white hover:text-amber-200 block px-3 py-2 rounded-md text-base font-medium font-bold border-t border-ocean-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => {
                setIsNotificationOpen(true);
                setIsMenuOpen(false);
              }}
              className="text-white hover:text-ocean-100 flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium border-t border-ocean-800 relative"
            >
              <Bell size={20} />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute left-7 top-2.5 h-2 w-2 bg-red-500 rounded-full border border-ocean-700 animate-pulse"></span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="text-white hover:text-ocean-100 w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </nav>
  );
};

export default Navbar;