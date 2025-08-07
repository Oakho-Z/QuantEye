
import React from 'react';
import { BellIcon } from './Icon';

export const Header: React.FC = () => {
  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-end px-8 border-b border-slate-800 bg-[#0f0f23]/50">
      <div className="flex items-center space-x-4">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <BellIcon />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
        <div className="w-px h-6 bg-slate-700"></div>
        <div className="flex items-center space-x-3">
          <img
            className="h-9 w-9 rounded-full object-cover"
            src="https://ui-avatars.com/api/?name=Alex+Morgan&background=16213e&color=e0e0e0&size=96"
            alt="User avatar"
          />
          <div>
            <p className="text-sm font-semibold text-white">Alex Morgan</p>
            <p className="text-xs text-slate-400">Portfolio Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};