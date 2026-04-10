import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users, Ship, Shield, ArrowRight, TrendingUp } from 'lucide-react';
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

        </div>
    );
};

export default AdminDashboardPage;