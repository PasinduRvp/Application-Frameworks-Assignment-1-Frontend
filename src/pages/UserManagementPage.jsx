import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, deleteUser } from '../redux/slices/userSlice';
import { Search, UserMinus, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';

const UserManagementPage = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers({ search: searchTerm }));
    }, [dispatch, searchTerm]);

    const handleRoleChange = async (userId, newRole) => {
        await dispatch(updateUser({ id: userId, userData: { role: newRole } }));
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        await dispatch(updateUser({ id: userId, userData: { isActive: !currentStatus } }));
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedUser) {
            await dispatch(deleteUser(selectedUser._id));
            setIsModalOpen(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600">Review and manage all system access credentials.</p>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    />
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center"><Loader /></td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No users found match your search.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-ocean-100 flex items-center justify-center">
                                                    <span className="text-ocean-600 font-bold uppercase">{user.name.charAt(0)}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="text-sm border-gray-300 rounded-md bg-white focus:ring-ocean-500 focus:border-ocean-500"
                                            >
                                                <option value="admin">Administrator</option>
                                                <option value="environmental_officer">Env. Officer</option>
                                                <option value="fleet_manager">Fleet Manager</option>
                                                <option value="ship_captain">Captain</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Deactivated'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => handleStatusToggle(user._id, user.isActive)}
                                                    title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                                    className={`${user.isActive ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'} transition-colors`}
                                                >
                                                    {user.isActive ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    title="Delete User"
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                >
                                                    <UserMinus size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm User Deletion"
            >
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <p className="text-gray-900 font-bold">Are you sure you want to delete {selectedUser?.name}?</p>
                        <p className="text-sm text-gray-500 mt-1">This action cannot be undone. All navigation history associated with this user will be orphaned.</p>

                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagementPage;
