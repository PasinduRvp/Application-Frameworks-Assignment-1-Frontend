import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { previewRoute, calculateRoute, clearCalculatedRoute } from '../../redux/slices/routeSlice';
import { fetchVessels } from '../../redux/slices/vesselSlice';
import { fetchMarineZones } from '../../redux/slices/marineZoneSlice';
import { MapPin, AlertTriangle, Ship, Navigation, CheckCircle, Save } from 'lucide-react';
import Loader from '../common/Loader';
import { formatDistance, formatEmission, formatDuration } from '../../utils/formatters';
import RouteMap from './RouteMap';

const RoutePlanner = () => {
  const [formData, setFormData] = useState({
    vessel: '',
    routeName: '',
    startPoint: {
      name: '',
      coordinates: ['', ''],
    },
    endPoint: {
      name: '',
      coordinates: ['', ''],
    },
    plannedDeparture: '',
  });
  const [selectionMode, setSelectionMode] = useState(null); // 'start', 'end' or null

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vessels } = useSelector((state) => state.vessels);
  const { zones } = useSelector((state) => state.marineZones);
  const { calculatedRoute, warnings, loading } = useSelector(
    (state) => state.routes
  );

  useEffect(() => {
    dispatch(fetchVessels({}));
    dispatch(fetchMarineZones({}));
    return () => {
      dispatch(clearCalculatedRoute());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCoordinateChange = (point, index, value) => {
    setFormData({
      ...formData,
      [point]: {
        ...formData[point],
        coordinates: formData[point].coordinates.map((coord, i) =>
          i === index ? value : coord
        ),
      },
    });
  };

  const handleLocationNameChange = (point, value) => {
    setFormData({
      ...formData,
      [point]: {
        ...formData[point],
        name: value,
      },
    });
  };

  const handleMapClick = (coords) => {
    if (!selectionMode) return;

    const [lng, lat] = coords;
    setFormData((prev) => ({
      ...prev,
      [selectionMode === 'start' ? 'startPoint' : 'endPoint']: {
        ...prev[selectionMode === 'start' ? 'startPoint' : 'endPoint'],
        coordinates: [lng.toFixed(6), lat.toFixed(6)],
      },
    }));

    // Auto-disable selection mode after picking
    setSelectionMode(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const routeData = {
      vessel: formData.vessel,
      routeName: formData.routeName,
      startPoint: {
        name: formData.startPoint.name,
        coordinates: [
          parseFloat(formData.startPoint.coordinates[0]),
          parseFloat(formData.startPoint.coordinates[1]),
        ],
      },
      endPoint: {
        name: formData.endPoint.name,
        coordinates: [
          parseFloat(formData.endPoint.coordinates[0]),
          parseFloat(formData.endPoint.coordinates[1]),
        ],
      },
      plannedDeparture: formData.plannedDeparture || undefined,
    };

    await dispatch(previewRoute(routeData));
  };

  const handleConfirm = async () => {
    if (!calculatedRoute) return;

    // The calculatedRoute object contains all metrics needed for saving
    const result = await dispatch(calculateRoute(calculatedRoute));

    if (calculateRoute.fulfilled.match(result)) {
      // Redirect to the newly created route's details page
      navigate(`/routes/${result.payload._id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6 h-fit">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Navigation className="mr-2 text-ocean-600" size={24} />
          Plan Your Route
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Route Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Route Name *
            </label>
            <input
              type="text"
              name="routeName"
              required
              value={formData.routeName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
              placeholder="e.g., Mumbai to Singapore"
            />
          </div>

          {/* Vessel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Vessel *
            </label>
            <select
              name="vessel"
              required
              value={formData.vessel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              <option value="">Choose a vessel...</option>
              {vessels.map((vessel) => (
                <option key={vessel._id} value={vessel._id}>
                  {vessel.name} ({vessel.registrationNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Start Point */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="mr-2 text-green-600" size={20} />
              Starting Point
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Location Name (e.g., Port of Mumbai)"
                value={formData.startPoint.name}
                onChange={(e) =>
                  handleLocationNameChange('startPoint', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Longitude *"
                  value={formData.startPoint.coordinates[0]}
                  onChange={(e) =>
                    handleCoordinateChange('startPoint', 0, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Latitude *"
                  value={formData.startPoint.coordinates[1]}
                  onChange={(e) =>
                    handleCoordinateChange('startPoint', 1, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setSelectionMode(selectionMode === 'start' ? null : 'start')}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium border transition-colors flex items-center justify-center ${selectionMode === 'start'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <MapPin size={16} className="mr-2" />
                {selectionMode === 'start' ? 'Click on Map to Set...' : 'Select Start on Map'}
              </button>
            </div>
          </div>

          {/* End Point */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="mr-2 text-red-600" size={20} />
              Destination Point
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Location Name (e.g., Port of Singapore)"
                value={formData.endPoint.name}
                onChange={(e) =>
                  handleLocationNameChange('endPoint', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Longitude *"
                  value={formData.endPoint.coordinates[0]}
                  onChange={(e) =>
                    handleCoordinateChange('endPoint', 0, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Latitude *"
                  value={formData.endPoint.coordinates[1]}
                  onChange={(e) =>
                    handleCoordinateChange('endPoint', 1, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setSelectionMode(selectionMode === 'end' ? null : 'end')}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium border transition-colors flex items-center justify-center ${selectionMode === 'end'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <MapPin size={16} className="mr-2" />
                {selectionMode === 'end' ? 'Click on Map to Set...' : 'Select Destination on Map'}
              </button>
            </div>
          </div>

          {/* Planned Departure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planned Departure (Optional)
            </label>
            <input
              type="datetime-local"
              name="plannedDeparture"
              value={formData.plannedDeparture}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {loading ? <Loader size="sm" /> : 'Preview Route Impact'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Route Details</h2>
          {calculatedRoute && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center">
              <CheckCircle size={14} className="mr-1" />
              Impact Calculated
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-12">
            <Loader />
          </div>
        ) : calculatedRoute ? (
          <div className="space-y-6">
            <RouteMap
              startPoint={calculatedRoute.startPoint}
              endPoint={calculatedRoute.endPoint}
              waypoints={calculatedRoute.waypoints}
              path={calculatedRoute.coordinates}
              zones={zones}
            />
            {/* ... rest of calculatedRoute view ... */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-ocean-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Distance</p>
                <p className="text-2xl font-bold text-ocean-900">
                  {formatDistance(calculatedRoute.totalDistance)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Est. Duration</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatDuration(calculatedRoute.estimatedDuration)}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Fuel Needed</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {calculatedRoute.estimatedFuelConsumption.toFixed(0)} L
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">CO₂ Emissions</p>
                <p className="text-2xl font-bold text-red-900">
                  {formatEmission(calculatedRoute.estimatedEmissions.co2)}
                </p>
              </div>
            </div>

            {/* Confirmation Button */}
            <div className="bg-ocean-50 border border-ocean-200 rounded-xl p-6 text-center shadow-inner">
              <h3 className="text-ocean-900 font-bold mb-2">Ready to proceed?</h3>
              <p className="text-ocean-700 text-sm mb-4">Click below to save this route and start tracking your voyage lifecycle.</p>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-lg flex items-center justify-center shadow-lg transition-transform hover:scale-[1.02]"
              >
                <Save className="mr-2" size={24} />
                Confirm & Save Route
              </button>
            </div>

            {/* Warnings */}
            {warnings && warnings.length > 0 && (
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <div className="flex items-start">
                  <AlertTriangle className="text-yellow-600 mr-3 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      Environmental Warnings
                    </h3>
                    <ul className="space-y-2">
                      {warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-yellow-800">
                          <strong>{warning.zoneName}:</strong> {warning.message}
                          <br />
                          <span className="text-yellow-700 italic">
                            {warning.recommendation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <RouteMap
                startPoint={{
                  name: formData.startPoint.name,
                  coordinates: [
                    parseFloat(formData.startPoint.coordinates[0]) || 0,
                    parseFloat(formData.startPoint.coordinates[1]) || 0
                  ]
                }}
                endPoint={{
                  name: formData.endPoint.name,
                  coordinates: [
                    parseFloat(formData.endPoint.coordinates[0]) || 0,
                    parseFloat(formData.endPoint.coordinates[1]) || 0
                  ]
                }}
                zones={zones}
                onMapClick={handleMapClick}
              />
              {selectionMode && (
                <div className="absolute inset-x-0 top-0 z-[1000] bg-ocean-600/90 text-white py-2 px-4 shadow-md flex justify-between items-center animate-pulse">
                  <span className="text-sm font-semibold">
                    {selectionMode === 'start' ? '📍 SELECT STARTING POINT' : '🏁 SELECT DESTINATION POINT'}
                  </span>
                  <button
                    onClick={() => setSelectionMode(null)}
                    className="text-white hover:text-ocean-100 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Ship className="mx-auto mb-2 text-gray-400 opacity-50" size={32} />
              <p className="text-sm">Click "Select on Map" to pick coordinates interactively.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;