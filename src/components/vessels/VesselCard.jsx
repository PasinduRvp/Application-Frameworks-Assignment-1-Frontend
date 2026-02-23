import React from 'react';
import { Ship, Edit, Trash2, MapPin } from 'lucide-react';
import { VESSEL_STATUS } from '../../utils/constants';

const VesselCard = ({ vessel, onEdit, onDelete, onClick }) => {
  const statusConfig = VESSEL_STATUS.find((s) => s.value === vessel.status);

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-ocean-100 p-3 rounded-lg">
            <Ship className="text-ocean-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{vessel.name}</h3>
            <p className="text-sm text-gray-500">{vessel.registrationNumber}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig?.color === 'green'
              ? 'bg-green-100 text-green-800'
              : statusConfig?.color === 'blue'
                ? 'bg-blue-100 text-blue-800'
                : statusConfig?.color === 'yellow'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
            }`}
        >
          {statusConfig?.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium text-gray-900 capitalize">
            {vessel.vesselType.replace('_', ' ')}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fuel Type:</span>
          <span className="font-medium text-gray-900 capitalize">
            {vessel.fuelType.replace('_', ' ')}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Avg Speed:</span>
          <span className="font-medium text-gray-900">
            {vessel.averageSpeed} knots
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Emission Rate:</span>
          <span className="font-medium text-gray-900">
            {vessel.emissionRate} kg CO₂/nm
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin size={16} className="mr-2" />
          <span>
            {vessel.currentLocation?.coordinates
              ? `${vessel.currentLocation.coordinates[1].toFixed(4)}°, ${vessel.currentLocation.coordinates[0].toFixed(4)}°`
              : 'Position N/A'}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(vessel);
            }}
            className="p-2 text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(vessel);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VesselCard;