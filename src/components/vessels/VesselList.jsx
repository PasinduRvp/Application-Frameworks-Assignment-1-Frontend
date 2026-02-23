import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVessels, deleteVessel } from '../../redux/slices/vesselSlice';
import VesselCard from './VesselCard';
import VesselForm from './VesselForm';
import Modal from '../common/Modal';
import Loader from '../common/Loader';
import { Plus, Search, Ship } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const VesselList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    vesselType: '',
    status: '',
  });

  const dispatch = useDispatch();
  const { vessels, loading, pagination } = useSelector((state) => state.vessels);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(
      fetchVessels({
        search: debouncedSearch,
        ...filters,
      })
    );
  }, [dispatch, debouncedSearch, filters]);

  const handleEdit = (vessel) => {
    setSelectedVessel(vessel);
    setIsModalOpen(true);
  };

  const handleDelete = async (vessel) => {
    if (window.confirm(`Are you sure you want to delete ${vessel.name}?`)) {
      await dispatch(deleteVessel(vessel._id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVessel(null);
  };

  const handleSuccess = () => {
    dispatch(fetchVessels({ search: debouncedSearch, ...filters }));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Vessel Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Vessel</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search vessels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          {/* Vessel Type Filter */}
          <select
            value={filters.vesselType}
            onChange={(e) =>
              setFilters({ ...filters, vesselType: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
          >
            <option value="">All Types</option>
            <option value="cargo">Cargo</option>
            <option value="tanker">Tanker</option>
            <option value="passenger">Passenger</option>
            <option value="fishing">Fishing</option>
            <option value="research">Research</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="docked">Docked</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Vessels Grid */}
      {loading ? (
        <div className="py-12">
          <Loader />
        </div>
      ) : vessels.length === 0 ? (
        <div className="text-center py-12">
          <Ship className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No vessels found</p>
          <p className="text-gray-400 text-sm mt-2">
            Add your first vessel to get started
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vessels.map((vessel) => (
              <VesselCard
                key={vessel._id}
                vessel={vessel}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClick={() => {}}
              />
            ))}
          </div>

          {/* Pagination Info */}
          {pagination && (
            <div className="mt-6 text-center text-sm text-gray-600">
              Showing {vessels.length} of {pagination.total} vessels
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedVessel ? 'Edit Vessel' : 'Add New Vessel'}
        size="lg"
      >
        <VesselForm
          vessel={selectedVessel}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
};

export default VesselList;