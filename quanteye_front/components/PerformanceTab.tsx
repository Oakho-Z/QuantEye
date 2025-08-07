import React, { useEffect, useState } from 'react';
import type { PortfolioMetrics, AssetRecommendation } from '../types';
import { MetricCard } from './MetricCard';
import { AssetAllocationChart } from './AssetAllocationChart';
import { AiAnalyst } from './AiAnalyst';
import { WarningIcon } from './Icon';

interface PerformanceTabProps {
  geminiApiKey: string;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({ geminiApiKey }) => {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<AssetRecommendation[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/performance_tab_chart_data');
        if (!res.ok) throw new Error('Failed to fetch chart data');
        const data = await res.json();
  
        setMetrics(data.portfolioMetrics); // ✅ 注意这里改了字段名
        setRecommendations(data.recommendations);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-white mt-10">加载中...</div>;
  }

  if (error || !metrics || !recommendations) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <WarningIcon className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-white">加载失败</h2>
        <p className="text-slate-400">{error || '后端无数据'}</p>
      </div>
    );
  }

  const latestRecs = recommendations.filter(
    (r) => r.date === recommendations[recommendations.length - 1].date
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Portfolio Performance Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Annual Return"
            value={`${metrics.portfolio_cagr.toFixed(2)}%`}
            comparisonValue={`${(metrics.portfolio_cagr - metrics.btc_cagr).toFixed(2)}%`}
            comparisonLabel="vs BTC"
            isPositive={metrics.portfolio_cagr > metrics.btc_cagr}
          />
          <MetricCard
            label="Sharpe Ratio"
            value={metrics.portfolio_sharpe.toFixed(2)}
            comparisonValue={`${(metrics.portfolio_sharpe - metrics.btc_sharpe).toFixed(2)}`}
            comparisonLabel="vs BTC"
            isPositive={metrics.portfolio_sharpe > metrics.btc_sharpe}
          />
          <MetricCard
            label="Max Drawdown"
            value={`${metrics.portfolio_mdd.toFixed(2)}%`}
            comparisonValue={`${(metrics.portfolio_mdd - metrics.btc_mdd).toFixed(2)}%`}
            comparisonLabel="vs BTC"
            isPositive={metrics.portfolio_mdd < metrics.btc_mdd}
            smallerIsBetter={true}
          />
          <MetricCard
            label="Win Rate"
            value={`${metrics.win_rate.toFixed(1)}%`}
            comparisonValue={`${metrics.outperform_rate.toFixed(1)}%`}
            comparisonLabel="vs BTC"
            isPositive={metrics.outperform_rate > 50}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Latest Portfolio Recommendations</h2>
          <div className="bg-[#1a1a2e]/50 p-4 rounded-lg border border-slate-800 h-[450px]">
            <AssetAllocationChart data={latestRecs} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-4">AI Portfolio Analyst</h2>
          <AiAnalyst metrics={metrics} recommendations={recommendations} geminiApiKey={geminiApiKey} />
        </div>
      </div>
    </div>
  );
};
