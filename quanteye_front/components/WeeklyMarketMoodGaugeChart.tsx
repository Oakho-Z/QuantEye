import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface GaugeData {
  value: number;
}

const SEGMENTS = [
  { name: '极弱', color: '#FF5252' },
  { name: '偏弱', color: '#FFA726' },
  { name: '偏强', color: '#FFEB3B' },
  { name: '极强', color: '#26A69A' },
];

const TICKS = [0, 0.25, 0.5, 0.75, 1.0];

export const WeeklyMarketMoodGaugeChart: React.FC = () => {
  const [targetValue, setTargetValue] = useState<number | null>(null);
  const [progress, setProgress] = useState(0); // 进度0~1
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 拉取数据
  useEffect(() => {
    fetch('/weekly_market_mood_gauge_data')
      .then(res => {
        if (!res.ok) throw new Error('数据请求失败');
        return res.json();
      })
      .then((json: GaugeData) => {
        const value = Math.min(Math.max(json.value, 0), 1);
        setTargetValue(value);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 动画同步：progress从0递增到targetValue
  useEffect(() => {
    if (targetValue === null) return;
    let start: number | null = null;
    const duration = 800;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const rate = Math.min(elapsed / duration, 1);
      setProgress(rate * targetValue);
      if (rate < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [targetValue]);

  if (loading) return <div className="text-white">加载中...</div>;
  if (error) return <div className="text-red-500">错误: {error}</div>;
  if (targetValue === null) return <div className="text-white">无数据</div>;

  // 计算角度
  const angle = -90 + progress * 180;

  // 根据进度，计算每段扇形占比（最大0.25，进度按比例展开）
  // 例如：进度0.5时，前两段满，第三段占一半，第四段0
  const segmentsValues = SEGMENTS.map((seg, idx) => {
    const segStart = idx * 0.25;
    const segEnd = (idx + 1) * 0.25;
    if (progress >= segEnd) return 0.25;
    if (progress <= segStart) return 0;
    return progress - segStart;
  });

  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={segmentsValues.map((v, i) => ({ value: v, color: SEGMENTS[i].color }))}
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
            dataKey="value"
            stroke="none"
            cx="50%"
            cy="50%"
            isAnimationActive={false} // 关闭内置动画
          >
            {segmentsValues.map((_, i) => (
              <Cell key={i} fill={SEGMENTS[i].color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* 刻度数字 */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {TICKS.map((tick, idx) => {
          const deg = 180 - tick * 180;
          const labelR = 58;
          const rad = (deg * Math.PI) / 180;
          const lx = 50 + labelR * Math.cos(rad);
          const ly = 50 - labelR * Math.sin(rad);
          return (
            <text
              key={idx}
              x={lx}
              y={ly}
              fill="white"
              fontSize="6"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {Math.round(tick * 100)}
            </text>
          );
        })}
      </svg>

      {/* 指针 */}
      <div
        className="absolute z-10 left-1/2 top-1/2 origin-bottom shadow-md"
        style={{
          transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          width: '3px',
          height: '40%',
          backgroundColor: '#fff',
          borderRadius: '2px',
          transition: 'transform 0.05s linear',
        }}
      />

      {/* 百分比数值 */}
      <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 text-2xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
        {(progress * 100).toFixed(0)}%
      </div>
    </div>
  );
};
