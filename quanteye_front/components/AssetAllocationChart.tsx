
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { AssetRecommendation } from '../types';

interface AssetAllocationChartProps {
  data: AssetRecommendation[];
}

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.weight - a.weight);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis type="number" stroke="#9ca3af" domain={[0, 'dataMax + 5']} tickFormatter={(tick) => `${tick.toFixed(0)}%`} />
        <YAxis type="category" dataKey="asset" stroke="#9ca3af" width={50} tick={{ fontSize: 12 }} />
        <Tooltip
          cursor={{ fill: 'rgba(74, 158, 255, 0.1)' }}
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#f9fafb', fontWeight: 'bold' }}
          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Weight']}
        />
        <Bar dataKey="weight" fill="#4a9eff" barSize={30} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
