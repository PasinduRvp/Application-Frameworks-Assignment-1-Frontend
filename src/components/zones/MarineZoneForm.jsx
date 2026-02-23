import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createMarineZone, updateMarineZone } from '../../redux/slices/marineZoneSlice';
import { ZONE_TYPES, PROTECTION_LEVELS } from '../../utils/constants';
import Loader from '../common/Loader';
import ZoneDrawer from './ZoneDrawer';
import { Map, List, AlertCircle,X } from 'lucide-react';

const MarineZoneForm = ({ zone, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    zoneType: 'marine_protected_area',
    protectionLevel: 'monitored',
    riskLevel: 5,
    speedLimit: '',
    description: '',
    coordinates: [], // Flexible array of [lng, lat]
  });

  const [inputMode, setInputMode] = useState('map'); // 'map' or 'manual'
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (zone) {
      // For editing, extract coordinates
      // GeoJSON Polygon coordinates are [ [ [lng, lat], [lng, lat], ... ] ]
      const rawCoords = zone.geometry?.coordinates?.[0] || [];
      // Remove the closing point for the UI drawer
      const displayCoords = rawCoords.length > 1
        ? rawCoords.slice(0, -1)
        : rawCoords;

      setFormData({
        name: zone.name || '',
        zoneType: zone.zoneType || 'marine_protected_area',
        protectionLevel: zone.protectionLevel || 'monitored',
        riskLevel: zone.riskLevel || 5,
        speedLimit: zone.speedLimit || '',
        description: zone.description || '',
        coordinates: displayCoords,
      });
    }
  }, [zone]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCoordinatesChange = (newCoords) => {
    setFormData({
      ...formData,
      coordinates: newCoords,
    });
  };

  const handleManualCoordChange = (index, field, value) => {
    const updated = [...formData.coordinates];
    updated[index] = [...updated[index]];
    updated[index][field === 'lng' ? 0 : 1] = parseFloat(value) || 0;
    setFormData({ ...formData, coordinates: updated });
  };

  const addManualPoint = () => {
    setFormData({
      ...formData,
      coordinates: [...formData.coordinates, [0, 0]]
    });
  };

  const removeManualPoint = (index) => {
    setFormData({
      ...formData,
      coordinates: formData.coordinates.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.coordinates.length < 3) {
      alert('A zone must have at least 3 points to form a polygon.');
      return;
    }

    setLoading(true);

    try {
      // GeoJSON requires a closed polygon (last point must equal first point)
      const numericCoords = formData.coordinates.map(p => [
        parseFloat(p[0]),
        parseFloat(p[1])
      ]);
      numericCoords.push([...numericCoords[0]]);

      const zoneData = {
        name: formData.name,
        zoneType: formData.zoneType,
        protectionLevel: formData.protectionLevel,
        riskLevel: parseInt(formData.riskLevel),
        speedLimit: formData.speedLimit ? parseInt(formData.speedLimit) : null,
        description: formData.description,
        geometry: {
          type: 'Polygon',
          coordinates: [numericCoords],
        },
      };

      if (zone) {
        await dispatch(updateMarineZone({ id: zone._id, zoneData }));
      } else {
        await dispatch(createMarineZone(zoneData));
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving zone:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zone Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              placeholder="e.g., Marine Protection Area A"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                name="zoneType"
                required
                value={formData.zoneType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {ZONE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Protection *
              </label>
              <select
                name="protectionLevel"
                required
                value={formData.protectionLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {PROTECTION_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk (1-10) *
              </label>
              <input
                type="number"
                name="riskLevel"
                required
                min="1"
                max="10"
                value={formData.riskLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Speed Limit (kts)
              </label>
              <input
                type="number"
                name="speedLimit"
                min="0"
                value={formData.speedLimit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Regulations, wildlife info..."
            />
          </div>
        </div>

        {/* Right Column: Geometry Mapping */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Zone Geometry (Area) *
            </label>
            <div className="flex bg-gray-100 p-1 rounded-md">
              <button
                type="button"
                onClick={() => setInputMode('map')}
                className={`flex items-center px-2 py-1 rounded text-xs ${inputMode === 'map' ? 'bg-white shadow-sm text-ocean-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Map size={14} className="mr-1" />
                Map Draw
              </button>
              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className={`flex items-center px-2 py-1 rounded text-xs ${inputMode === 'manual' ? 'bg-white shadow-sm text-ocean-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List size={14} className="mr-1" />
                Raw List
              </button>
            </div>
          </div>

          {inputMode === 'map' ? (
            <ZoneDrawer
              coordinates={formData.coordinates}
              onChange={handleCoordinatesChange}
            />
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start mb-4">
                <AlertCircle size={18} className="text-amber-500 mr-2 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Enter coordinates in decimal degrees (e.g., 80.123, 6.456).
                  Points will form a closed polygon automatically.
                </p>
              </div>

              {formData.coordinates.map((coord, idx) => (
                <div key={idx} className="flex space-x-2 items-center">
                  <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}</span>
                  <input
                    type="number"
                    step="any"
                    value={coord[0]}
                    onChange={(e) => handleManualCoordChange(idx, 'lng', e.target.value)}
                    placeholder="Longitude"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    step="any"
                    value={coord[1]}
                    onChange={(e) => handleManualCoordChange(idx, 'lat', e.target.value)}
                    placeholder="Latitude"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeManualPoint(idx)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addManualPoint}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-ocean-300 hover:text-ocean-600 transition-colors mt-2"
              >
                + Add Point
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 border-t pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors shadow-md disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <>
              <Loader size="sm" className="mr-2" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{zone ? 'Update Marine Zone' : 'Create Marine Zone'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default MarineZoneForm;
