import React from 'react';
import { MapPin, Shield, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { PROTECTION_LEVELS } from '../../utils/constants';

const MarineZoneCard = ({ zone, onEdit, onDelete, onFocus }) => {
  const protectionConfig = PROTECTION_LEVELS.find(
    (p) => p.value === zone.protectionLevel
  );

  const getRiskColor = (level) => {
    if (level >= 8) return 'text-red-600 bg-red-100';
    if (level >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-ocean-100 p-3 rounded-lg">
            <Shield className="text-ocean-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {zone.zoneType.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        {/* Protection Level Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${protectionConfig?.color === 'red'
            ? 'bg-red-100 text-red-800'
            : protectionConfig?.color === 'orange'
              ? 'bg-orange-100 text-orange-800'
              : protectionConfig?.color === 'yellow'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}
        >
          {protectionConfig?.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center">
            <AlertCircle size={16} className="mr-1" />
            Risk Level:
          </span>
          <span
            className={`px-2 py-1 rounded font-semibold ${getRiskColor(
              zone.riskLevel
            )}`}
          >
            {zone.riskLevel}/10
          </span>
        </div>

        {zone.speedLimit && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Speed Limit:</span>
            <span className="font-medium text-gray-900">
              {zone.speedLimit} knots
            </span>
          </div>
        )}

        {zone.description && (
          <div className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
            <p className="line-clamp-2">{zone.description}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onFocus}
          className="flex items-center text-ocean-600 hover:text-ocean-700 text-sm font-bold bg-ocean-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <MapPin size={16} className="mr-1.5" />
          View on Map
        </button>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(zone)}
              className="p-2 text-gray-400 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
            >
              <Edit size={18} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(zone)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarineZoneCard;