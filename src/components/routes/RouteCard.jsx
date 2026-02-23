import React from 'react';
import { Navigation, Calendar, MapPin } from 'lucide-react';
import { formatDate, formatDistance, formatEmission } from '../../utils/formatters';
import { ROUTE_STATUS } from '../../utils/constants';

const RouteCard = ({ route, onClick, onDelete }) => {
  const statusConfig = ROUTE_STATUS.find((s) => s.value === route.status);

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-ocean-100 p-3 rounded-lg">
            <Navigation className="text-ocean-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {route.routeName}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin size={14} className="mr-1" />
              <span>
                {route.startPoint.name || 'Start'} → {route.endPoint.name || 'End'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
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
          <p className="font-semibold text-gray-900 truncate">
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

      {/* Protected Areas Warning */}
      {route.protectedAreasAvoided?.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
          <p className="text-xs text-yellow-800">
            ⚠️ Intersects with {route.protectedAreasAvoided.length} protected area(s)
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="px-4 py-2 text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors text-sm font-medium"
        >
          View Details
        </button>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(route);
            }}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default RouteCard;