import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRoutes, deleteRoute } from '../../redux/slices/routeSlice';
import RouteCard from './RouteCard';
import Loader from '../common/Loader';
import { Navigation, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const RouteList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { routes, loading } = useSelector((state) => state.routes);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(
      fetchRoutes({
        search: debouncedSearch,
        status: statusFilter,
      })
    );
  }, [dispatch, debouncedSearch, statusFilter]);

  const handleDelete = async (route) => {
    if (window.confirm(`Are you sure you want to delete "${route.routeName}"?`)) {
      await dispatch(deleteRoute(route._id));
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
          >
            <option value="">All Status</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Routes Grid */}
      {loading ? (
        <div className="py-12">
          <Loader />
        </div>
      ) : routes.length === 0 ? (
        <div className="text-center py-12">
          <Navigation className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No routes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <RouteCard
              key={route._id}
              route={route}
              onClick={() => navigate(`/routes/${route._id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteList;