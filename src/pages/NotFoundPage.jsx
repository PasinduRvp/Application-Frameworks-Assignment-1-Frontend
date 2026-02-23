import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Ship } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Ship className="mx-auto text-ocean-600 mb-4" size={64} />
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! This page seems to have sailed away.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
        >
          <Home size={20} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;