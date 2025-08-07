import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { TimeSeriesData } from '../types';

interface CumulativeReturnChartProps {
  // 不再通过 props 传入数据了
}

export const CumulativeReturnChart: React.FC<CumulativeReturnChartProps> = () => {
  const [data, setData] = useState<TimeSeriesData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/performance_data')
      .then(res => {
        if (!res.ok) throw new Error('数据请求失败');
        return res.json();
      })
      .then(json => {
        setData(json.cumulativeReturns);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white">加载中...</div>;
  if (error) return <div className="text-red-500">错误: {error}</div>;
  if (!data || data.length === 0) return <div className="text-white">无数据</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} tickFormatter={(str) => str.substring(5)} />
        <YAxis stroke="#9ca3af" tickFormatter={(tick) => `${(tick * 100 - 100).toFixed(0)}%`} domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#f9fafb', fontWeight: 'bold' }}
          formatter={(value: number) => [`${((value - 1) * 100).toFixed(2)}%`, 'Return']}
        />
        <Legend wrapperStyle={{ color: '#d1d5db' }} />
        <Line type="monotone" dataKey="portfolio" name="QuantEye Portfolio" stroke="#4a9eff" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="btc" name="BTC Benchmark" stroke="#f7931a" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};
