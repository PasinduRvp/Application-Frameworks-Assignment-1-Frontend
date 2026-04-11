import React from 'react';
import { MapPin, Shield, AlertCircle, Edit, Trash2, ShieldAlert } from 'lucide-react';
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

  const isEmergency = zone.isEmergency;

  return (
    <div className={`rounded-lg shadow-md hover:shadow-lg transition-all p-6 border-2 ${isEmergency
        ? 'bg-red-50 border-red-500 ring-1 ring-red-200 shadow-red-100'
        : 'bg-white border-transparent'
      }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${isEmergency ? 'bg-red-600' : 'bg-ocean-100'} p-3 rounded-lg transition-colors`}>
            {isEmergency ? (
              <ShieldAlert className="text-white animate-pulse" size={24} />
            ) : (
              <Shield className="text-ocean-600" size={24} />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-lg font-bold ${isEmergency ? 'text-red-900' : 'text-gray-900'}`}>{zone.name}</h3>
              {isEmergency && (
                <span className="bg-red-600 text-white text-[10px] uppercase font-black px-1.5 py-0.5 rounded flex items-center">
                  <span className="w-1 h-1 bg-white rounded-full mr-1 animate-ping"></span>
                  Emergency
                </span>
              )}
            </div>
            <p className={`text-sm capitalize ${isEmergency ? 'text-red-700 font-medium' : 'text-gray-500'}`}>
              {zone.zoneType.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        {/* Protection Level Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${protectionConfig?.color === 'red'
            ? 'bg-red-100 text-red-800 border border-red-200'
            : protectionConfig?.color === 'orange'
              ? 'bg-orange-100 text-orange-800 border border-orange-200'
              : protectionConfig?.color === 'yellow'
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
        >
          {protectionConfig?.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className={`flex items-center ${isEmergency ? 'text-red-800 font-medium' : 'text-gray-600'}`}>
            <AlertCircle size={16} className="mr-1" />
            Risk Level:
          </span>
          <span
            className={`px-2 py-1 rounded font-bold border ${getRiskColor(
              zone.riskLevel
            )} ${isEmergency ? 'border-red-300' : 'border-transparent'}`}
          >
            {zone.riskLevel}/10
          </span>
        </div>

        {zone.speedLimit && (
          <div className="flex justify-between text-sm">
            <span className={isEmergency ? 'text-red-800' : 'text-gray-600'}>Speed Limit:</span>
            <span className={`font-bold ${isEmergency ? 'text-red-900' : 'text-gray-900'}`}>
              {zone.speedLimit} knots
            </span>
          </div>
        )}

        {zone.description && (
          <div className={`text-sm mt-3 pt-3 border-t ${isEmergency ? 'text-red-800 border-red-200' : 'text-gray-600 border-gray-200'}`}>
            <p className="line-clamp-2 italic">{zone.description}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={`flex items-center justify-between pt-4 border-t ${isEmergency ? 'border-red-200' : 'border-gray-200'}`}>
        <button
          onClick={onFocus}
          className={`flex items-center text-sm font-bold px-3 py-1.5 rounded-lg transition-all ${isEmergency
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200'
              : 'bg-ocean-50 text-ocean-600 hover:text-ocean-700'
            }`}
        >
          <MapPin size={16} className="mr-1.5" />
          View on Map
        </button>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(zone)}
              className={`p-2 rounded-lg transition-colors ${isEmergency ? 'text-red-700 hover:bg-red-200' : 'text-gray-400 hover:text-ocean-600 hover:bg-ocean-50'
                }`}
            >
              <Edit size={18} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(zone)}
              className={`p-2 rounded-lg transition-colors ${isEmergency ? 'text-red-700 hover:bg-red-200' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                }`}
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
