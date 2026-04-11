import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users, Ship, Shield, Settings, ArrowRight, TrendingUp, MapPin } from 'lucide-react';
import { fetchVessels } from '../redux/slices/vesselSlice';
import { fetchMarineZones } from '../redux/slices/marineZoneSlice';
import { fetchUsers } from '../redux/slices/userSlice';

const AdminDashboardPage = () => {
    const dispatch = useDispatch();
    const { vessels } = useSelector((state) => state.vessels);
    const { zones } = useSelector((state) => state.marineZones);
    const { users } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchVessels({}));
        dispatch(fetchMarineZones({}));
        dispatch(fetchUsers({ limit: 100 }));
    }, [dispatch]);

    const stats = [
        {
            label: 'Total Users',
            count: users.length,
            icon: Users,
            gradient: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            link: '/admin/users',
            trend: '+12% this month'
        },
        {
            label: 'Active Vessels',
            count: vessels.length,
            icon: Ship,
            gradient: 'from-cyan-500 to-teal-600',
            bg: 'bg-cyan-50',
            iconColor: 'text-cyan-600',
            link: '/vessels',
            trend: '+3 new this week'
        },
        {
            label: 'Marine Zones',
            count: zones.length,
            icon: Shield,
            gradient: 'from-emerald-500 to-green-600',
            bg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            link: '/marine-zones',
            trend: 'All zones active'
        },
    ];

    const navCards = [
        {
            icon: Users,
            title: 'Manage Users',
            description: 'View, edit, and control user accounts. Assign roles like Admin or Environmental Officer and manage access permissions.',
            link: '/admin/users',
            gradient: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            hoverBorder: 'hover:border-blue-300',
            btnClass: 'bg-blue-600 hover:bg-blue-700',
        },
        {
            icon: Ship,
            title: 'Vessel Hub',
            description: 'Browse and manage all registered vessels in the system. Track status, ownership, and voyage activity.',
            link: '/vessels',
            gradient: 'from-cyan-500 to-teal-600',
            iconBg: 'bg-cyan-50',
            iconColor: 'text-cyan-600',
            hoverBorder: 'hover:border-cyan-300',
            btnClass: 'bg-cyan-600 hover:bg-cyan-700',
        },
        {
            icon: MapPin,
            title: 'Zone Hub',
            description: 'Manage marine protection zones, restricted areas, and environmental boundaries across all coastal regions.',
            link: '/marine-zones',
            gradient: 'from-emerald-500 to-green-600',
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            hoverBorder: 'hover:border-emerald-300',
            btnClass: 'bg-emerald-600 hover:bg-emerald-700',
        },
    ];

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1 text-base">Centralized control center for system administrators.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
                    System Online
                </span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <Link key={idx} to={stat.link} className="group">
                        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 overflow-hidden">
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
                            <div className="flex items-start justify-between mt-1">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-4xl font-black text-gray-900 mt-2 leading-none">{stat.count}</p>
                                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                        <TrendingUp size={12} />
                                        {stat.trend}
                                    </p>
                                </div>
                                <div className={`${stat.bg} p-3 rounded-xl`}>
                                    <stat.icon size={26} className={stat.iconColor} />
                                </div>
                            </div>
                            <div className={`mt-4 flex items-center gap-1 text-sm font-semibold ${stat.iconColor} group-hover:gap-2 transition-all`}>
                                <span>View details</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Navigation Cards */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {navCards.map((card, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-2xl border border-gray-200 ${card.hoverBorder} shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col`}
                        >
                            {/* Gradient bar */}
                            <div className={`h-1.5 bg-gradient-to-r ${card.gradient}`} />

                            <div className="p-6 flex flex-col flex-1">
                                {/* Icon + Title */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`${card.iconBg} p-3 rounded-xl`}>
                                        <card.icon size={24} className={card.iconColor} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">
                                    {card.description}
                                </p>

                                {/* CTA Button */}
                                <Link
                                    to={card.link}
                                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold ${card.btnClass} transition-colors duration-200`}
                                >
                                    Open {card.title}
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Settings Banner */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm mb-4">
                    <Settings className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-700">Global System Settings</h3>
                <p className="text-gray-400 mt-1 text-sm max-w-md mx-auto">
                    Advanced system configurations, audit logs, and diagnostic tools will appear here in future updates.
                </p>
            </div>

        </div>
    );
};

export default AdminDashboardPage;