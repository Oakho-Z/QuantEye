
import React, { useState } from 'react';
import type { TimeSeriesData, DrawdownData } from '../types';
import { CumulativeReturnChart } from './CumulativeReturnChart';
import { WeeklyMarketMoodGaugeChart } from './WeeklyMarketMoodGaugeChart';
import { DrawdownChart } from './DrawdownChart';
import { ChartWrapper } from './ChartWrapper';
import { WarningIcon } from './Icon';

interface ChartsTabProps {
  cumulativeReturns: TimeSeriesData[] | null;
  drawdown: DrawdownData[] | null;
}

type ChartType = 'returns' | 'drawdown' | 'WeeklyMarketMoodGaugeChart';

export const ChartsTab: React.FC<ChartsTabProps> = ({ cumulativeReturns, drawdown,  }) => {
  const [activeChart, setActiveChart] = useState<ChartType>('returns');

  if (!cumulativeReturns || !drawdown) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <WarningIcon className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-white">No Chart Data</h2>
        <p className="text-slate-400">Run the pipeline to generate performance charts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Performance Charts</h2>
        <div className="flex space-x-2 bg-[#1a1a2e]/50 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveChart('WeeklyMarketMoodGaugeChart')}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeChart === 'WeeklyMarketMoodGaugeChart' ? 'bg-[#4a9eff] text-white' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            WeeklyMarketMoodGaugeChart
          </button>
          <button
            onClick={() => setActiveChart('returns')}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeChart === 'returns' ? 'bg-[#4a9eff] text-white' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            Cumulative Returns
          </button>
          <button
            onClick={() => setActiveChart('drawdown')}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeChart === 'drawdown' ? 'bg-[#4a9eff] text-white' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            Drawdown Analysis
          </button>
        </div>
      </div>
      
      <div className="w-full h-[500px]">
        {activeChart === 'WeeklyMarketMoodGaugeChart' && (
          <ChartWrapper title="Weekly Market Mood Gauge">
            <WeeklyMarketMoodGaugeChart  />
          </ChartWrapper>
        )}
        {activeChart === 'returns' && (
          <ChartWrapper title="Cumulative Returns vs. BTC Benchmark">
            <CumulativeReturnChart />
          </ChartWrapper>
        )}
        {activeChart === 'drawdown' && (
          <ChartWrapper title="Portfolio Drawdown Analysis">
            <DrawdownChart />
          </ChartWrapper>
        )}
      </div>
    </div>
  );
};
