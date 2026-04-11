import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, deleteUser, createUser } from '../redux/slices/userSlice';
import { Search, UserMinus, ShieldAlert, CheckCircle, XCircle, AlertTriangle, UserPlus, X, Eye, EyeOff } from 'lucide-react';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

/* ── Confirm-action toast body ── */
const ConfirmActionToast = ({ message, onConfirm, onCancel, closeToast }) => (
    <div className="p-1">
        <p className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-500" />
            {message}
        </p>
        <div className="flex justify-end gap-2">
            <button
                onClick={() => {
                    onCancel?.();
                    closeToast();
                }}
                className="px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
            >
                No
            </button>
            <button
                onClick={() => {
                    onConfirm();
                    closeToast();
                }}
                className="px-3 py-1 text-xs font-semibold bg-ocean-600 text-white hover:bg-ocean-700 rounded shadow-sm transition-colors"
            >
                Yes, Confirm
            </button>
        </div>
    </div>
);

/* ── Add User Modal ── */
const ROLES = [
    { value: 'ship_captain', label: 'Ship Captain' },
    { value: 'fleet_manager', label: 'Fleet Manager' },
    { value: 'environmental_officer', label: 'Environmental Officer' },
    { value: 'admin', label: 'Administrator' },
];

const INITIAL_FORM = {
    name: '',
    email: '',
    password: '',
    role: 'ship_captain',
    organization: '',
    phoneNumber: '',
};

const AddUserModal = ({ onClose, onCreated }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState(INITIAL_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        const result = await dispatch(createUser(form));
        setSubmitting(false);

        if (!result.error) {
            toast.success(`User "${form.name}" created successfully!`);
            onCreated?.();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-ocean-600">
                    <div className="flex items-center gap-2 text-white">
                        <UserPlus size={20} />
                        <h2 className="text-lg font-bold">Add New User</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-ocean-700 rounded-md p-1 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. John Silva"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 outline-none transition-all ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 outline-none transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Min. 6 characters"
                                className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 outline-none transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 outline-none bg-white"
                        >
                            {ROLES.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Optional fields — row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                            <input
                                name="organization"
                                value={form.organization}
                                onChange={handleChange}
                                placeholder="Company name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="+94 77 000 0000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 text-sm font-semibold text-white bg-ocean-600 hover:bg-ocean-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    Creating…
                                </>
                            ) : (
                                <>
                                    <UserPlus size={16} />
                                    Create User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ── Main Page ── */
const UserManagementPage = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers({ search: searchTerm }));
    }, [dispatch, searchTerm]);

    const handleRoleChange = (userId, newRole) => {
        toast.info(
            <ConfirmActionToast
                message={`Change user role to ${newRole.replace(/_/g, ' ')}?`}
                onConfirm={async () => {
                    await dispatch(updateUser({ id: userId, userData: { role: newRole } }));
                    toast.success('User role updated successfully');
                }}
            />,
            { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
        );
    };

    const handleStatusToggle = (userId, currentStatus, userName) => {
        const action = currentStatus ? 'Deactivate' : 'Activate';
        if (action === 'Activate') {
            dispatch(updateUser({ id: userId, userData: { isActive: true } }));
            toast.success(`${userName} activated successfully`);
            return;
        }

        toast.warning(
            <ConfirmActionToast
                message={`Are you sure you want to deactivate ${userName}?`}
                onConfirm={async () => {
                    await dispatch(updateUser({ id: userId, userData: { isActive: false } }));
                    toast.success(`${userName} deactivated`);
                }}
            />,
            { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
        );
    };

    const handleDeleteClick = (user) => {
        toast.error(
            <ConfirmActionToast
                message={`Permanently delete user ${user.name}?`}
                onConfirm={async () => {
                    await dispatch(deleteUser(user._id));
                    toast.success('User deleted successfully');
                }}
            />,
            { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
        );
    };

    return (
        <div className="space-y-6">
            {/* Add User Modal */}
            {showAddModal && (
                <AddUserModal
                    onClose={() => setShowAddModal(false)}
                    onCreated={() => dispatch(fetchUsers({ search: searchTerm }))}
                />
            )}

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600">Review and manage all system access credentials.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative w-full sm:w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 text-sm"
                        />
                    </div>

                    {/* Add User button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white text-sm font-semibold rounded-lg hover:bg-ocean-700 shadow-sm transition-colors whitespace-nowrap"
                    >
                        <UserPlus size={16} />
                        Add User
                    </button>
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
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No users found matching your search.</td>
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
                                                className="text-sm border-gray-300 rounded-md bg-white focus:ring-ocean-500 focus:border-ocean-500 transition-all hover:border-ocean-400"
                                            >
                                                <option value="admin">Administrator</option>
                                                <option value="environmental_officer">Env. Officer</option>
                                                <option value="fleet_manager">Fleet Manager</option>
                                                <option value="ship_captain">Captain</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.isActive ? 'Active' : 'Deactivated'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => handleStatusToggle(user._id, user.isActive, user.name)}
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
        </div>
    );
};

export default UserManagementPage;
