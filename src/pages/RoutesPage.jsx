import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRoutes, deleteRoute } from '../redux/slices/routeSlice';
import { Navigation, Plus, Search, Calendar } from 'lucide-react';
import Loader from '../components/common/Loader';
import { formatDate, formatDistance, formatEmission } from '../utils/formatters';
import { ROUTE_STATUS } from '../utils/constants';

const RoutesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { routes, loading } = useSelector((state) => state.routes);

  useEffect(() => {
    dispatch(
      fetchRoutes({
        search: searchTerm,
        status: statusFilter,
      })
    );
  }, [dispatch, searchTerm, statusFilter]);

  const handleDelete = async (route) => {
    if (window.confirm(`Are you sure you want to delete route "${route.routeName}"?`)) {
      await dispatch(deleteRoute(route._id));
      dispatch(fetchRoutes({ search: searchTerm, status: statusFilter }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Route Management
        </h1>
        <button
          onClick={() => navigate('/route-planner')}
          className="flex items-center space-x-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
        >
          <Plus size={20} />
          <span>Plan New Route</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
          >
            <option value="">All Status</option>
            {ROUTE_STATUS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Routes List */}
      {loading ? (
        <div className="py-12">
          <Loader />
        </div>
      ) : routes.length === 0 ? (
        <div className="text-center py-12">
          <Navigation className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No routes found</p>
          <button
            onClick={() => navigate('/route-planner')}
            className="mt-4 text-ocean-600 hover:text-ocean-700 font-medium"
          >
            Plan your first route
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {routes.map((route) => {
            const statusConfig = ROUTE_STATUS.find((s) => s.value === route.status);

            return (
              <div
                key={route._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {route.routeName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Navigation size={16} className="mr-2" />
                      <span>
                        {route.startPoint.name || 'Start Point'} →{' '}
                        {route.endPoint.name || 'End Point'}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusConfig?.color === 'green'
                        ? 'bg-green-100 text-green-800'
                        : statusConfig?.color === 'yellow'
                        ? 'bg-yellow-100 text-yellow-800'
                        : statusConfig?.color === 'red'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {statusConfig?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="font-semibold text-gray-900">
                      {formatDistance(route.totalDistance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Emissions</p>
                    <p className="font-semibold text-gray-900">
                      {formatEmission(route.estimatedEmissions.co2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Vessel</p>
                    <p className="font-semibold text-gray-900">
                      {route.vessel?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      Created
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(route.createdAt)}
                    </p>
                  </div>
                </div>

                {route.protectedAreasAvoided?.length > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ This route intersects with{' '}
                      {route.protectedAreasAvoided.length} protected area(s)
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/routes/${route._id}`)}
                    className="px-4 py-2 text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(route)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoutesPage;