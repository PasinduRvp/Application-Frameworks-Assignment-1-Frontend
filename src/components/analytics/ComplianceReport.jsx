import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ComplianceReport = ({ violations }) => {
  const sampleViolations = violations || [
    {
      type: 'speed_limit',
      severity: 'medium',
      description: 'Exceeded 10 knots in protected zone',
      timestamp: new Date().toISOString(),
    },
    {
      type: 'restricted_area',
      severity: 'high',
      description: 'Entered no-entry zone',
      timestamp: new Date().toISOString(),
    },
  ];

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
        };
      case 'high':
        return {
          icon: XCircle,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
        };
      case 'medium':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        };
    }
  };

  const complianceRate =
    violations?.length > 0
      ? ((1 - violations.length / 100) * 100).toFixed(1)
      : 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Compliance Report
      </h3>

      {/* Compliance Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
        <p className="text-sm mb-1">Overall Compliance Rate</p>
        <p className="text-4xl font-bold">{complianceRate}%</p>
      </div>

      {/* Violations List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Recent Violations</h4>
        {sampleViolations.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
            <p className="text-gray-500">No violations recorded</p>
          </div>
        ) : (
          sampleViolations.map((violation, index) => {
            const config = getSeverityConfig(violation.severity);
            const Icon = config.icon;

            return (
              <div
                key={index}
                className={`p-4 ${config.bg} border ${config.border} rounded-lg`}
              >
                <div className="flex items-start">
                  <Icon className={`${config.color} mr-3 mt-1`} size={20} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 capitalize">
                      {violation.type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {violation.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(violation.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${config.color} ${config.bg}`}
                  >
                    {violation.severity}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ComplianceReport;