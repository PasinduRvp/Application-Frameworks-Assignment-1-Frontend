import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { User, Mail, Building, Shield, Phone, Edit2, Save, X } from 'lucide-react';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';

const ProfilePage = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        organization: user.organization || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(formData));
    if (result.type === 'auth/updateProfile/fulfilled') {
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
          >
            <Edit2 size={18} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <div className="text-center">
              <div className="bg-ocean-100 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="text-ocean-600" size={48} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 text-left">
                <p className="text-xs text-gray-500 uppercase font-semibold">Account Status</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700">Active</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Details Form/View */}
        <div className="md:col-span-2">
          <Card>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center space-x-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader size="sm" /> : (
                      <>
                        <Save size={18} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="text-gray-400 mr-4" size={24} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
                    <p className="text-gray-900 font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Building className="text-gray-400 mr-4" size={24} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Organization</p>
                    <p className="text-gray-900 font-medium">{user?.organization || 'Not Specified'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="text-gray-400 mr-4" size={24} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Phone Number</p>
                    <p className="text-gray-900 font-medium">{user?.phoneNumber || 'Not Specified'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Shield className="text-gray-400 mr-4" size={24} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">User Role</p>
                    <p className="text-gray-900 font-medium capitalize">{user?.role?.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 italic text-sm text-gray-500">
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
