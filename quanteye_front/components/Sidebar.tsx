import React from 'react';
import { SettingsIcon, KeyIcon } from './Icon';

interface SidebarProps {
  config: {
    topN: number;
    gamma: number;
  };
  onConfigChange: (newConfig: Partial<{ topN: number; gamma: number }>) => void;
  apiKeys: {
    coinCompare: string;
    gemini: string;
  };
  onApiKeyChange: (newKeys: Partial<{ coinCompare: string; gemini: string; }>) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ config, onConfigChange, apiKeys, onApiKeyChange }) => {
  return (
    <aside className="w-80 bg-[#0f0f23] border-r border-slate-800 flex flex-col hidden md:flex">
      {/* Placeholder div to reserve space and provide a positioning context for the logo */}
      <div className="relative h-32">
        <img 
          src="https://res.cloudinary.com/duxbnigg7/image/upload/v1753636944/%E4%BD%A0%E7%9A%84%E6%AE%B5%E8%90%BD%E6%96%87%E5%AD%97_n15hwg.png" 
          alt="QuantEye Logo" 
          className="w-full h-auto transform scale-[1.4] absolute -top-10 left-0"
        />
      </div>

      <div className="space-y-10 px-6 mt-10">
        <div>
          <h2 className="text-sm font-semibold text-slate-400 tracking-wider flex items-center mb-4">
            <SettingsIcon />
            <span className="ml-2">Optimization Parameters</span>
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="topN" className="text-sm font-medium text-slate-300 flex justify-between">
                <span>Top Assets (TOP_N)</span>
                <span className="font-bold text-[#4a9eff]">{config.topN}</span>
              </label>
              <input
                id="topN"
                type="range"
                min="5"
                max="15"
                step="1"
                value={config.topN}
                onChange={(e) => onConfigChange({ topN: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gamma" className="text-sm font-medium text-slate-300 flex justify-between">
                <span>Risk Aversion (γ)</span>
                <span className="font-bold text-[#4a9eff]">{config.gamma.toFixed(1)}</span>
              </label>
              <input
                id="gamma"
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={config.gamma}
                onChange={(e) => onConfigChange({ gamma: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-400 tracking-wider flex items-center mb-4">
              <KeyIcon />
              <span className="ml-2">API Keys</span>
          </h2>
          <div className="space-y-4">
              <div>
                  <label htmlFor="coinCompareKey" className="text-sm font-medium text-slate-300">
                      CoinCompare API Key
                  </label>
                  <input
                      id="coinCompareKey"
                      type="password"
                      value={apiKeys.coinCompare}
                      onChange={(e) => onApiKeyChange({ coinCompare: e.target.value })}
                      placeholder="Enter your key"
                      className="mt-1 w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
              </div>
              <div>
                  <label htmlFor="geminiKey" className="text-sm font-medium text-slate-300">
                      Google Gemini API Key
                  </label>
                  <input
                      id="geminiKey"
                      type="password"
                      value={apiKeys.gemini}
                      onChange={(e) => onApiKeyChange({ gemini: e.target.value })}
                      placeholder="Enter your key"
                      className="mt-1 w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
              </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto text-center text-xs text-slate-500 px-6 pb-6">
        <p>&copy; {new Date().getFullYear()} QuantEye. All rights reserved.</p>
        <p>For institutional use only.</p>
      </div>

       <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #4a9eff;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #4a9eff;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        input[type="range"]:hover::-webkit-slider-thumb {
          background: #6b73ff;
        }
         input[type="range"]:hover::-moz-range-thumb {
          background: #6b73ff;
        }
      `}</style>
    </aside>
  );
};