
import React from 'react';

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, children }) => {
  return (
    <div className="w-full h-full bg-[#1a1a2e]/50 p-6 rounded-lg border border-slate-800 flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="flex-grow w-full h-full">
        {children}
      </div>
    </div>
  );
};
