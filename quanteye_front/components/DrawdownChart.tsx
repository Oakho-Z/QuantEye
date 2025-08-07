import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { DrawdownData } from '../types';

export const DrawdownChart: React.FC = () => {
  const [data, setData] = useState<DrawdownData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5053/drawdown_data')  // 后端接口地址，根据实际改
      .then(res => {
        if (!res.ok) throw new Error(`请求错误: ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (json.drawdown && Array.isArray(json.drawdown)) {
          setData(json.drawdown);
        } else {
          throw new Error('接口返回数据格式不正确');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white">数据加载中...</div>;
  if (error) return <div className="text-red-500">加载出错: {error}</div>;
  if (!data || data.length === 0) return <div className="text-yellow-400">暂无回撤数据</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
          tickFormatter={(str) => str.substring(5)}
        />
        <YAxis stroke="#9ca3af" tickFormatter={(tick) => `${tick.toFixed(0)}%`} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#f9fafb', fontWeight: 'bold' }}
          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Drawdown']}
        />
        <Area
          type="monotone"
          dataKey="drawdown"
          stroke="#ef4444"
          fillOpacity={1}
          fill="url(#colorDrawdown)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
