import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PipelineTab } from './components/PipelineTab';
import { PerformanceTab } from './components/PerformanceTab';
import { ChartsTab } from './components/ChartsTab';
import { TabButton } from './components/TabButton';
import { mockDataService } from './services/mockDataService';
import type { PortfolioMetrics, AssetRecommendation, TimeSeriesData } from './types';
import { EyeIcon, WarningIcon } from './components/Icon';

enum Tab {
  Pipeline = 'Pipeline',
  Performance = 'Performance & AI',
  Charts = 'Charts',
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Pipeline);
  const [pipelineCompleted, setPipelineCompleted] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [config, setConfig] = useState({ topN: 8, gamma: 1.5 });
  const [apiKeys, setApiKeys] = useState({ coinCompare: '', gemini: '' });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleConfigChange = useCallback((newConfig: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const handleApiKeyChange = useCallback((newKeys: Partial<typeof apiKeys>) => {
    setApiKeys(prev => ({...prev, ...newKeys}));
  }, []);
  
  const data = useMemo(() => {
    if (!pipelineCompleted) return null;
    return mockDataService.generateAllData();
  }, [pipelineCompleted]);

  const renderTabContent = () => {
    switch (activeTab) {
      case Tab.Pipeline:
        return <PipelineTab 
        onPipelineComplete={() => setPipelineCompleted(true)} 
        config={config}/>;
      case Tab.Performance:
        return <PerformanceTab geminiApiKey={apiKeys.gemini} />;
      case Tab.Charts:
        return <ChartsTab cumulativeReturns={data?.cumulativeReturns} drawdown={data?.drawdown} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A1A] text-gray-200 flex">
      <Sidebar config={config} onConfigChange={handleConfigChange} apiKeys={apiKeys} onApiKeyChange={handleApiKeyChange}/>
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
             <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
               <span className="p-2 bg-gray-800/50 rounded-lg mr-3"><EyeIcon /></span>
               {activeTab}
            </h1>
            <div className="flex space-x-1 sm:space-x-2 bg-[#16213E]/50 border border-slate-700 p-1 rounded-lg">
              {(Object.values(Tab)).map(tab => (
                <TabButton
                  key={tab}
                  onClick={() => {
                    if (tab !== Tab.Pipeline && !pipelineCompleted) {
                      setNotification("Please run the pipeline first.");
                      return;
                    }
                    setActiveTab(tab);
                  }}
                  isActive={activeTab === tab}
                  disabled={tab !== Tab.Pipeline && !pipelineCompleted}
                >
                  {tab}
                </TabButton>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-[#0f0f23]/70 border border-slate-800 rounded-xl shadow-2xl shadow-black/30 p-4 sm:p-6 lg:p-8">
            {renderTabContent()}
          </div>
        </div>
      </main>
      
      {notification && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg shadow-2xl animate-fade-in-out z-50 flex items-center border border-red-400">
          <WarningIcon className="mr-3" />
          <span>{notification}</span>
        </div>
      )}
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;