
import React from 'react';

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({ children, isActive, ...props }) => {
  const baseClasses = "px-4 py-2 text-sm font-bold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16213E] focus:ring-white";
  const activeClasses = "bg-gradient-to-r from-[#4a9eff] to-[#6b73ff] text-white shadow-lg";
  const inactiveClasses = "bg-slate-700/50 text-slate-300 hover:bg-slate-600/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} {...props}>
      {children}
    </button>
  );
};
