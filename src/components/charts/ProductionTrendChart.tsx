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
  Cell,
} from 'recharts';
import { formatNumber } from '../../utils/formatting';

interface ProductionTrendChartProps {
  data: any[];
  yearColumns: string[];
}

export const ProductionTrendChart: React.FC<ProductionTrendChartProps> = ({
  data,
  yearColumns,
}) => {
  const chartData = yearColumns.map((year) => {
    const fuelPowered = data.reduce((sum, item) => sum + (item[`${year}_fuel`] || 0), 0);
    const newEnergy = data.reduce((sum, item) => sum + (item[`${year}_nev`] || 0), 0);

    return {
      year,
      'Fuel-powered': fuelPowered,
      'New Energy': newEnergy,
      total: fuelPowered + newEnergy,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow text-xs">
          <p className="font-semibold">{data.year}</p>
          <p className="text-blue-600">
            Fuel-powered: {formatNumber(data['Fuel-powered'])}
          </p>
          <p className="text-green-600">New Energy: {formatNumber(data['New Energy'])}</p>
          <p className="font-semibold">Total: {formatNumber(data.total)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="year" stroke="#6B7280" />
        <YAxis stroke="#6B7280" tickFormatter={(value) => formatNumber(value)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="Fuel-powered" stackId="a" fill="#C4DAEC" />
        <Bar dataKey="New Energy" stackId="a" fill="#005195" />
      </BarChart>
    </ResponsiveContainer>
  );
};
