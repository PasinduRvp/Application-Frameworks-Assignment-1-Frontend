import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const FuelSavings = ({ data }) => {
  const chartData = [
    { name: 'Fuel Saved', value: data?.fuelSaved || 0 },
    { name: 'Fuel Used', value: data?.totalActualFuel || 0 },
  ];

  const COLORS = ['#10b981', '#3b82f6'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Fuel Efficiency Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-green-900">
            Total Fuel Saved
          </span>
          <span className="text-lg font-bold text-green-700">
            {data?.fuelSaved?.toFixed(2) || 0} L
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-900">
            Savings Percentage
          </span>
          <span className="text-lg font-bold text-blue-700">
            {data?.savingsPercentage?.toFixed(2) || 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default FuelSavings;