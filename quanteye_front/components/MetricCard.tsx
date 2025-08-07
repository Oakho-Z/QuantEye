
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from './Icon';

interface MetricCardProps {
  label: string;
  value: string;
  comparisonValue: string;
  comparisonLabel: string;
  isPositive: boolean;
  smallerIsBetter?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, comparisonValue, comparisonLabel, isPositive, smallerIsBetter = false }) => {
  const displayPositive = smallerIsBetter ? !isPositive : isPositive;

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e]/80 p-5 rounded-xl border border-slate-800 shadow-lg transition-all duration-300 hover:border-[#4a9eff]/50 hover:shadow-blue-500/10">
      <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <div className="flex items-center text-sm">
        <span className={`flex items-center mr-2 ${displayPositive ? 'text-green-400' : 'text-red-400'}`}>
          {displayPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
          <span className="font-semibold ml-1">{comparisonValue}</span>
        </span>
        <span className="text-slate-500">{comparisonLabel}</span>
      </div>
    </div>
  );
};
