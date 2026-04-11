import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MapPin, Navigation, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import { updateRouteStatus } from '../../redux/slices/routeSlice';
import { useAuth } from '../../hooks/useAuth';
import {
  formatDate,
  formatDistance,
  formatEmission,
  formatDuration,
} from '../../utils/formatters';
import { ROUTE_STATUS } from '../../utils/constants';
import RouteMap from './RouteMap';

const RouteDetails = ({ route, zones = [] }) => {
  const dispatch = useDispatch();
  const { user, isAdmin } = useAuth();
  const [updating, setUpdating] = useState(false);
  const statusConfig = ROUTE_STATUS.find((s) => s.value === route.status);

  // Authorization check: Only Admin or the Route Creator can change status
  const canManageStatus = isAdmin || user?._id === route.createdBy?._id || user?._id === route.createdBy;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await dispatch(updateRouteStatus({ id: route._id, status: newStatus }));
    setUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Center - Only for authorized users */}
      {canManageStatus && route.status !== 'completed' && route.status !== 'cancelled' && (
        <div className="bg-white rounded-lg shadow-sm border border-ocean-100 p-4 flex items-center justify-between">
          <div className="flex items-center text-ocean-700">
            <Clock size={20} className="mr-2" />
            <span className="font-semibold">Voyage Controls</span>
          </div>
          <div className="flex space-x-3">
            {route.status === 'planned' && (
              <button
                disabled={updating}
                onClick={() => handleStatusChange('in_progress')}
                className="flex items-center px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <Play size={18} className="mr-2" />
                Start Voyage
              </button>
            )}
            {route.status === 'in_progress' && (
              <button
                disabled={updating}
                onClick={() => handleStatusChange('completed')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <CheckCircle size={18} className="mr-2" />
                Mark as Completed
              </button>
            )}
            <button
              disabled={updating}
              onClick={() => handleStatusChange('cancelled')}
              className="flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <XCircle size={18} className="mr-2" />
              Cancel Route
            </button>
          </div>
        </div>
      )}

      {/* Map View */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <RouteMap
          startPoint={route.startPoint}
          endPoint={route.endPoint}
          waypoints={route.waypoints}
          path={route.coordinates}
          zones={zones}
        />
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {route.routeName}
            </h2>
            <div className="flex items-center text-gray-600">
              <Navigation size={20} className="mr-2" />
              <span>
                {route.startPoint.name} → {route.endPoint.name}
              </span>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig?.color === 'green'
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-ocean-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Distance</p>
            <p className="text-xl font-bold text-ocean-900">
              {formatDistance(route.totalDistance)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Duration</p>
            <p className="text-xl font-bold text-green-900">
              {formatDuration(route.estimatedDuration)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Fuel</p>
            <p className="text-xl font-bold text-yellow-900">
              {route.estimatedFuelConsumption.toFixed(0)} L
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">CO₂</p>
            <p className="text-xl font-bold text-red-900">
              {formatEmission(route.estimatedEmissions.co2)}
            </p>
          </div>
        </div>
      </div>

      {/* Vessel Information */}
      {route.vessel && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vessel Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-900">{route.vessel.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registration</p>
              <p className="font-semibold text-gray-900">
                {route.vessel.registrationNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-semibold text-gray-900 capitalize">
                {route.vessel.vesselType?.replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Speed</p>
              <p className="font-semibold text-gray-900">
                {route.vessel.averageSpeed} knots
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Route Points */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Route Points
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <MapPin className="text-green-600 mr-3 mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-900">Starting Point</p>
              <p className="text-sm text-gray-600">
                {route.startPoint.name || 'Start Location'}
              </p>
              <p className="text-xs text-gray-500">
                {route.startPoint.coordinates[1].toFixed(4)}°,{' '}
                {route.startPoint.coordinates[0].toFixed(4)}°
              </p>
            </div>
          </div>

          {route.waypoints?.map((waypoint, index) => (
            <div key={index} className="flex items-start">
              <MapPin className="text-blue-600 mr-3 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">
                  Waypoint {index + 1}
                </p>
                <p className="text-sm text-gray-600">
                  {waypoint.name || `Waypoint ${index + 1}`}
                </p>
              </div>
            </div>
          ))}

          <div className="flex items-start">
            <MapPin className="text-red-600 mr-3 mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-900">Destination</p>
              <p className="text-sm text-gray-600">
                {route.endPoint.name || 'End Location'}
              </p>
              <p className="text-xs text-gray-500">
                {route.endPoint.coordinates[1].toFixed(4)}°,{' '}
                {route.endPoint.coordinates[0].toFixed(4)}°
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Protected Areas */}
      {route.protectedAreasAvoided?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Protected Areas Intersected
          </h3>
          <div className="space-y-3">
            {route.protectedAreasAvoided.map((zone) => (
              <div
                key={zone._id}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-4"
              >
                <p className="font-semibold text-yellow-900">{zone.name}</p>
                <p className="text-sm text-yellow-800 capitalize">
                  {zone.zoneType?.replace('_', ' ')} -{' '}
                  {zone.protectionLevel?.replace('_', ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Created</span>
            <span className="font-semibold">{formatDate(route.createdAt)}</span>
          </div>
          {route.plannedDeparture && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Planned Departure</span>
              <span className="font-semibold">
                {formatDate(route.plannedDeparture)}
              </span>
            </div>
          )}
          {route.actualDeparture && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Actual Departure</span>
              <span className="font-semibold">
                {formatDate(route.actualDeparture)}
              </span>
            </div>
          )}
          {route.plannedArrival && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Planned Arrival</span>
              <span className="font-semibold">
                {formatDate(route.plannedArrival)}
              </span>
            </div>
          )}
          {route.actualArrival && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Actual Arrival</span>
              <span className="font-semibold">
                {formatDate(route.actualArrival)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;