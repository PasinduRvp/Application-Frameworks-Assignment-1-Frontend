import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

const AlertsPanel = ({ alerts }) => {
  const sampleAlerts = alerts || [
    {
      type: 'warning',
      title: 'Route Optimization Available',
      message: 'Alternative route can save 15% fuel consumption',
      timestamp: new Date().toISOString(),
    },
    {
      type: 'info',
      title: 'Weather Update',
      message: 'Moderate winds expected in next 24 hours',
      timestamp: new Date().toISOString(),
    },
    {
      type: 'success',
      title: 'Compliance Maintained',
      message: 'All vessels operating within environmental limits',
      timestamp: new Date().toISOString(),
    },
  ];

  const getAlertConfig = (type) => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
        };
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
        };
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
        };
      default:
        return {
          icon: Info,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Alerts
      </h3>

      <div className="space-y-3">
        {sampleAlerts.map((alert, index) => {
          const config = getAlertConfig(alert.type);
          const Icon = config.icon;

          return (
            <div
              key={index}
              className={`p-4 ${config.bg} border ${config.border} rounded-lg`}
            >
              <div className="flex items-start">
                <Icon className={`${config.color} mr-3 mt-1 flex-shrink-0`} size={20} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPanel;