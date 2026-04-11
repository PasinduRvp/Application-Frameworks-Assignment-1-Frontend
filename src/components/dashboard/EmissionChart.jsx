import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const EmissionChart = ({ data }) => {
  // Mock data if no real data provided
  const chartData = data || [
    { month: 'Jan', emissions: 2400 },
    { month: 'Feb', emissions: 1398 },
    { month: 'Mar', emissions: 2800 },
    { month: 'Apr', emissions: 3908 },
    { month: 'May', emissions: 4800 },
    { month: 'Jun', emissions: 3800 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Emission Trends (Last 6 Months)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={data ? "date" : "month"}
            tickFormatter={(val) => data ? new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : val}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="emissions"
            stroke="#0097a7"
            strokeWidth={2}
            name="CO₂ Emissions (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionChart;