import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createVessel, updateVessel } from '../../redux/slices/vesselSlice';
import { VESSEL_TYPES, FUEL_TYPES, VESSEL_STATUS } from '../../utils/constants';
import Loader from '../common/Loader';

const VesselForm = ({ vessel, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    vesselType: 'cargo',
    fuelType: 'diesel',
    maxSpeed: '',
    averageSpeed: '',
    length: '',
    width: '',
    emissionRate: '',
    fuelConsumptionRate: '',
    status: 'active',
    yearBuilt: '',
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (vessel) {
      setFormData({
        name: vessel.name || '',
        registrationNumber: vessel.registrationNumber || '',
        vesselType: vessel.vesselType || 'cargo',
        fuelType: vessel.fuelType || 'diesel',
        maxSpeed: vessel.maxSpeed || '',
        averageSpeed: vessel.averageSpeed || '',
        length: vessel.length || '',
        width: vessel.width || '',
        emissionRate: vessel.emissionRate || '',
        fuelConsumptionRate: vessel.fuelConsumptionRate || '',
        status: vessel.status || 'active',
        yearBuilt: vessel.yearBuilt || '',
      });
    }
  }, [vessel]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert numeric fields from strings to numbers
      const processedData = {
        ...formData,
        maxSpeed: Number(formData.maxSpeed),
        averageSpeed: Number(formData.averageSpeed),
        length: Number(formData.length),
        width: Number(formData.width),
        emissionRate: Number(formData.emissionRate),
        fuelConsumptionRate: Number(formData.fuelConsumptionRate),
        ...(formData.yearBuilt ? { yearBuilt: Number(formData.yearBuilt) } : {}),
      };

      if (vessel) {
        await dispatch(updateVessel({ id: vessel._id, data: processedData })).unwrap();
      } else {
        await dispatch(createVessel(processedData)).unwrap();
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving vessel:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vessel Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vessel Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            placeholder="e.g., SS Atlantic"
          />
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number *
          </label>
          <input
            type="text"
            name="registrationNumber"
            required
            value={formData.registrationNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            placeholder="e.g., IMO1234567"
          />
        </div>

        {/* Vessel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vessel Type *
          </label>
          <select
            name="vesselType"
            required
            value={formData.vesselType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
          >
            {VESSEL_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type *
          </label>
          <select
            name="fuelType"
            required
            value={formData.fuelType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
          >
            {FUEL_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Max Speed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Speed (knots) *
          </label>
          <input
            type="number"
            name="maxSpeed"
            required
            min="0"
            max="50"
            step="0.1"
            value={formData.maxSpeed}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            placeholder="e.g., 22.5"
          />
        </div>

        {/* Average Speed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Average Speed (knots) *
          </label>
          <input
            type="number"
            name="averageSpeed"
            required
            min="0"
            max="50"
            step="0.1"
            value={formData.averageSpeed}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            placeholder="e.g., 18"
          />
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Length (meters) *
          </label>
          <input
            type="number"
            name="length"
            required
            min="0"
            step="0.1"
            value={formData.length}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            placeholder="e.g., 150"
          />
        </div>

        {/* Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (meters) *
          </label>
          <input
            type="number"
            name="width"
            required
            min="0"
            step="0.1"
            value={formData.width}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            placeholder="e.g., 25"
          />
        </div>

        {/* Emission Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emission Rate (kg CO2/nm) *
          </label>
          <input
            type="number"
            name="emissionRate"
            required
            min="0"
            step="0.1"
            value={formData.emissionRate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            placeholder="e.g., 50"
          />
        </div>

        {/* Fuel Consumption Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Consumption (L/nm) *
          </label>
          <input
            type="number"
            name="fuelConsumptionRate"
            required
            min="0"
            step="0.1"
            value={formData.fuelConsumptionRate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            placeholder="e.g., 20"
          />
        </div>

        {/* Year Built */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year Built
          </label>
          <input
            type="number"
            name="yearBuilt"
            min="1900"
            max={new Date().getFullYear()}
            value={formData.yearBuilt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
            placeholder="e.g., 2015"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
          >
            {VESSEL_STATUS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-ocean-600 text-white rounded-md hover:bg-ocean-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader size="sm" /> : vessel ? 'Update Vessel' : 'Create Vessel'}
        </button>
      </div>
    </form>
  );
};

export default VesselForm;