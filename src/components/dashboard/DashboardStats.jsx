import React from 'react';
import { Ship, Route, AlertTriangle, TrendingDown } from 'lucide-react';
import { formatNumber, formatEmission } from '../../utils/formatters';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Distance',
      value: stats?.totalDistance
        ? `${formatNumber(stats.totalDistance)} nm`
        : '0 nm',
      icon: Route,
      color: 'ocean',
      bgColor: 'bg-ocean-100',
      iconColor: 'text-ocean-600',
    },
    {
      title: 'CO₂ Emissions',
      value: stats?.totalEmissions
        ? formatEmission(stats.totalEmissions)
        : '0 kg',
      icon: TrendingDown,
      color: 'red',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      title: 'Routes Completed',
      value: stats?.routesCompleted || 0,
      icon: Ship,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Violations',
      value: stats?.totalViolations || 0,
      icon: AlertTriangle,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-lg`}>
              <card.icon className={card.iconColor} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;