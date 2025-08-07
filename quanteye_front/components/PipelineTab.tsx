import React, { useState, useEffect } from 'react';

const pipelineStages = [
  "Station 1: Fetching crypto OHLCV data & CoinDesk news",
  "Station 2: Feature engineering (momentum, volatility, sentiment)",
  "Station 3: Portfolio optimization & backtesting",
  "Pipeline Complete"
];

interface PipelineTabProps {
  onPipelineComplete: () => void;
  config: {
    topN: number;
    gamma: number;
  };
}

export const PipelineTab: React.FC<PipelineTabProps> = ({ onPipelineComplete, config }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Pipeline idle. Click RUN to start.");
  const [completed, setCompleted] = useState(false);

  // 进度条缓慢增长到80%
  useEffect(() => {
    let timer: number | undefined;
    if (isRunning && progress < 80) {
      timer = window.setInterval(() => {
        setProgress(p => Math.min(p + 1, 80));
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, progress]);

  // 根据progress显示不同阶段状态文本
  useEffect(() => {
    if (!isRunning) return;
    if (progress >= 66) {
      setStatusText(`🔄 ${pipelineStages[2]}`);
    } else if (progress >= 33) {
      setStatusText(`🔄 ${pipelineStages[1]}`);
    } else {
      setStatusText(`🔄 ${pipelineStages[0]}`);
    }
  }, [progress, isRunning]);

  const handleRunPipeline = () => {
    if (isRunning || completed) return;

    setIsRunning(true);
    setProgress(0);
    setStatusText("🚀 Pipeline started...");
    setCompleted(false);

    fetch('/run_pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gamma: config.gamma,
        top_n: config.topN
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Pipeline execution failed');
        }
        return response.json();
      })
      .then(data => {
        // 请求完成，进度条直接跳到100%
        setProgress(100);
        setStatusText("✅ Pipeline completed successfully!");
        setCompleted(true);
        setIsRunning(false);
        onPipelineComplete();
      })
      .catch(error => {
        console.error('Pipeline failed:', error);
        setStatusText("❌ Pipeline failed.");
        setIsRunning(false);
      });

  };

  const getStageStatus = (stageIndex: number) => {
    if (progress >= ((stageIndex + 1) * 33.33)) return 'completed';
    if (progress >= (stageIndex * 33.33) && isRunning) return 'running';
    return 'pending';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-white mb-4">Pipeline Execution</h2>
        <p className="text-slate-400 mb-8">
          Execute the multi-stage process to generate an optimized portfolio based on the latest market data and risk parameters.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
          {pipelineStages.slice(0, 3).map((stage, index) => (
            <React.Fragment key={stage}>
              <div
                className={`flex items-center p-3 rounded-lg transition-all duration-500 ${
                  getStageStatus(index) === 'completed'
                    ? 'text-green-400'
                    : getStageStatus(index) === 'running'
                    ? 'text-blue-400'
                    : 'text-slate-500'
                }`}
              >
                {getStageStatus(index) === 'completed' ? (
                  <CheckCircleIcon />
                ) : (
                  <span className="font-mono text-lg">{`S${index + 1}`}</span>
                )}
                <span className="ml-2 text-sm text-left hidden lg:inline">{stage.split(':')[1]}</span>
              </div>
              {index < 2 && <ChevronRightIcon className="text-slate-600 hidden md:block" />}
            </React.Fragment>
          ))}
        </div>

        <div className="w-full max-w-md mx-auto mb-4">
          <div className="w-full bg-slate-700/50 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-[#4a9eff] to-[#6b73ff] h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-slate-300 mt-3 text-sm h-5">{statusText}</p>
        </div>

        <button
          onClick={handleRunPipeline}
          disabled={isRunning || completed}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#16213E] to-[#0f3460] border-2 border-slate-600 rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-600"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
          <span className="relative">{completed ? "Completed" : isRunning ? "Running..." : "Run"}</span>
        </button>
      </div>
    </div>
  );
};

// 你需要确保以下图标组件存在：
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
