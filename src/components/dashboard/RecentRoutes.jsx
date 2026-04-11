import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';

const RecentRoutes = ({ routes }) => {
  if (!routes || routes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Routes</h3>
        <p className="text-gray-500 text-center py-8">No recent routes found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Routes</h3>
      <div className="space-y-4">
        {routes.slice(0, 5).map((route, index) => (
          <div key={route.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-ocean-100 p-2 rounded-lg">
                <MapPin className="text-ocean-600" size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {route.startPoint?.name || 'Start'} → {route.endPoint?.name || 'End'}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(route.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{route.estimatedTime || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Distance</p>
              <p className="font-semibold text-gray-900">
                {route.distance ? `${route.distance} nm` : 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRoutes;
