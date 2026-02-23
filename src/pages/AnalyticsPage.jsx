import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmissionStats,
  fetchFuelSavings,
} from '../redux/slices/analyticsSlice';
import { TrendingDown, Droplet, DollarSign, Leaf, AlertTriangle, Shield, MapPin } from 'lucide-react';
import Loader from '../components/common/Loader';
import { formatNumber, formatCurrency, formatEmission } from '../utils/formatters';

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { emissionStats, fuelSavings, loading } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchEmissionStats({}));
    dispatch(fetchFuelSavings());
  }, [dispatch]);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Environmental Analytics
      </h1>

      {!emissionStats && !fuelSavings ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="bg-ocean-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="text-ocean-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Analytics Data Yet</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Once you complete your first voyage, your environmental impact, fuel efficiency, and cost savings will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Emission Statistics */}
          {emissionStats && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Emission Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Total CO₂ Emitted</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatEmission(emissionStats.totalCO2)}
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <TrendingDown className="text-red-600" size={26} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Fuel Consumption</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatNumber(emissionStats.totalFuel)} L
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <Droplet className="text-yellow-600" size={26} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-ocean-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Total Distance</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatNumber(emissionStats.totalDistance)} nm
                      </p>
                    </div>
                    <div className="bg-ocean-50 p-3 rounded-lg">
                      <Leaf className="text-ocean-600" size={26} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Total Violations</p>
                      <p className="text-3xl font-bold text-red-600">
                        {emissionStats.totalViolations || 0}
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <AlertTriangle className="text-red-600" size={26} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fuel Savings */}
          {fuelSavings && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Efficiency & Savings Report
                </h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Based on route compliance and speed optimization
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Droplet className="mr-2 text-ocean-600" size={18} />
                    Fuel Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-600">Standard Estimated:</span>
                      <span className="font-bold text-gray-900">
                        {formatNumber(fuelSavings.totalEstimatedFuel)} L
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border-l-4 border-ocean-500">
                      <span className="text-gray-600">Actual Optimized:</span>
                      <span className="font-bold text-ocean-700">
                        {formatNumber(fuelSavings.totalActualFuel)} L
                      </span>
                    </div>
                    <div className="flex justify-between pt-4">
                      <span className="text-green-600 font-bold text-lg">Total Fuel Saved</span>
                      <div className="text-right">
                        <span className="font-black text-2xl text-green-600">
                          {formatNumber(fuelSavings.fuelSaved)} L
                        </span>
                        <p className="text-xs text-green-500 font-semibold">
                          ({fuelSavings.savingsPercentage}% Efficiency)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-ocean-700 rounded-lg shadow-lg p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg uppercase tracking-wider">Estimated Cost Savings</h3>
                      <DollarSign size={40} className="text-green-300 opacity-50" />
                    </div>
                    <p className="text-5xl font-black mb-4">
                      {formatCurrency(fuelSavings.costSavings)}
                    </p>
                    <p className="text-ocean-100 text-sm leading-relaxed max-w-xs">
                      Estimated financial reduction achieved through environmental compliance and Eco-Speed optimization.
                    </p>
                  </div>
                  {/* Decorative background circle */}
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </div>
              </div>
            </div>
          )}
          {/* Recent Violations */}
          {emissionStats?.recentViolations && emissionStats.recentViolations.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="mr-2 text-red-600" size={20} />
                Recent Environmental Infractions
              </h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-red-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Vessel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {emissionStats.recentViolations.map((violation, index) => (
                      <tr key={index} className="hover:bg-red-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {violation.vesselName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(violation.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800 uppercase">
                            {violation.type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${violation.severity === 'high' || violation.severity === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : violation.severity === 'medium'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {violation.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {violation.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;