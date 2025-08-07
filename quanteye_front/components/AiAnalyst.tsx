import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import type { ChatMessage, PortfolioMetrics, AssetRecommendation } from '../types';
import { SendIcon, BotIcon, WarningIcon } from './Icon';

interface AiAnalystProps {
    metrics: PortfolioMetrics;
    recommendations: AssetRecommendation[];
    geminiApiKey: string;
}

export const AiAnalyst: React.FC<AiAnalystProps> = ({ metrics, recommendations, geminiApiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome! I'm your AI Portfolio Analyst. Ask me about performance, risk, or asset allocation." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add a placeholder for the assistant's response
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
        const stream = await geminiService.streamPortfolioAnalysis(input, metrics, recommendations, geminiApiKey);
        
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage.role === 'assistant') {
                    return [...prev.slice(0, -1), { ...lastMessage, content: lastMessage.content + chunkText }];
                }
                return prev;
            });
        }
    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = `Sorry, I encountered an error: ${errorMessage}`;
          }
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!geminiApiKey) {
    return (
      <div className="h-[450px] bg-[#1a1a2e]/50 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center p-4">
        <WarningIcon className="w-12 h-12 text-yellow-500 mb-4" />
        <h3 className="font-bold text-white">AI Analyst Disabled</h3>
        <p className="text-sm text-slate-400">Please provide a Google Gemini API key in the sidebar to enable this feature.</p>
      </div>
    );
  }

  return (
    <div className="h-[450px] bg-[#1a1a2e]/50 rounded-lg border border-slate-800 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-700 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.content}
              {isLoading && msg.role === 'assistant' && index === messages.length -1 && !msg.content && <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse" />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about the portfolio..."
            className="w-full bg-slate-800 border border-slate-600 rounded-full py-2 pl-4 pr-12 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};