import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const EmissionsReport = ({ data }) => {
  // Sample data structure
  const chartData = data || [
    { name: 'Jan', co2: 2400, nox: 240, sox: 120 },
    { name: 'Feb', co2: 1398, nox: 140, sox: 70 },
    { name: 'Mar', co2: 2800, nox: 280, sox: 140 },
    { name: 'Apr', co2: 3908, nox: 391, sox: 195 },
    { name: 'May', co2: 4800, nox: 480, sox: 240 },
    { name: 'Jun', co2: 3800, nox: 380, sox: 190 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Emissions Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="co2" fill="#ef4444" name="CO₂ (kg)" />
          <Bar dataKey="nox" fill="#f59e0b" name="NOx (kg)" />
          <Bar dataKey="sox" fill="#eab308" name="SOx (kg)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionsReport;