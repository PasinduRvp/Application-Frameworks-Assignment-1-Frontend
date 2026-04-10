import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  fetchMarineZones,
  deleteMarineZone,
} from '../redux/slices/marineZoneSlice';
import MarineZoneCard from '../components/zones/MarineZoneCard';
import MarineZoneForm from '../components/zones/MarineZoneForm';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { Plus, Search, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ZoneMap from '../components/zones/ZoneMap';

const MarineZonesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedZone, setFocusedZone] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const { zones, loading } = useSelector((state) => state.marineZones);
  const { isAdmin, isEnvironmentalOfficer } = useAuth();

  const canManageZones = isAdmin || isEnvironmentalOfficer;

  useEffect(() => {
    dispatch(fetchMarineZones({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const focusId = queryParams.get('focus');

    if (focusId && zones.length > 0) {
      const zoneToFocus = zones.find((z) => z._id === focusId);
      if (zoneToFocus) {
        setFocusedZone(zoneToFocus);
        
      }
    }
  }, [location.search, zones]);

  const handleEdit = (zone) => {
    setSelectedZone(zone);
    setIsModalOpen(true);
  };

  const handleDelete = async (zone) => {
    if (window.confirm(`Are you sure you want to delete ${zone.name}?`)) {
      await dispatch(deleteMarineZone(zone._id));
    }
  };

  const handleFocusZone = (zone) => {
    setFocusedZone(zone);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedZone(null);
  };

  const handleSuccess = () => {
    dispatch(fetchMarineZones({}));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Marine Protected Zones
        </h1>
        {canManageZones && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Zone</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search marine zones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
          />
        </div>
      </div>

      {/* Map View */}
      <div className="mb-6">
        <ZoneMap zones={zones} focusedZone={focusedZone} />
      </div>

      {/* Zones Grid */}
      {loading ? (
        <div className="py-12">
          <Loader />
        </div>
      ) : zones.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No marine zones found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <MarineZoneCard
              key={zone._id}
              zone={zone}
              onEdit={canManageZones ? handleEdit : undefined}
              onDelete={canManageZones ? handleDelete : undefined}
              onFocus={() => handleFocusZone(zone)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {canManageZones && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedZone ? 'Edit Marine Zone' : 'Add New Marine Zone'}
          size="lg"
        >
          <MarineZoneForm
            zone={selectedZone}
            onClose={handleCloseModal}
            onSuccess={handleSuccess}
          />
        </Modal>
      )}
    </div>
  );
};

export default MarineZonesPage;