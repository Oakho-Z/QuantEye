import { GoogleGenAI } from "@google/genai";
import type { PortfolioMetrics, AssetRecommendation } from '../types';

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private currentApiKey: string | null = null;

  private initialize(apiKey: string) {
    // Only re-initialize if the key is new and valid
    if (apiKey && apiKey !== this.currentApiKey) {
        this.ai = new GoogleGenAI({ apiKey });
        this.currentApiKey = apiKey;
    } else if (!apiKey) {
        this.ai = null;
        this.currentApiKey = null;
    }
  }

  private buildPrompt(question: string, metrics: PortfolioMetrics, recommendations: AssetRecommendation[]): string {
    const context = `
      You are an expert cryptocurrency portfolio analyst named 'QuantEye AI', working with a sophisticated portfolio optimization platform. You have access to the following portfolio data:

      PORTFOLIO METRICS:
      - Annual Return (CAGR): ${metrics.portfolio_cagr.toFixed(2)}% (BTC: ${metrics.btc_cagr.toFixed(2)}%)
      - Sharpe Ratio: ${metrics.portfolio_sharpe.toFixed(2)} (BTC: ${metrics.btc_sharpe.toFixed(2)})
      - Max Drawdown: ${metrics.portfolio_mdd.toFixed(2)}% (BTC: ${metrics.btc_mdd.toFixed(2)}%)
      - Win Rate: ${metrics.win_rate.toFixed(1)}%
      - Outperform Rate vs BTC: ${metrics.outperform_rate.toFixed(1)}%

      LATEST RECOMMENDATIONS:
      ${recommendations.filter(r => r.date === recommendations[recommendations.length - 1].date)
        .map(r => `- ${r.asset}: ${r.weight.toFixed(2)}% weight`).join('\n')}

      Based on this data, please answer the following question in a professional, institutional manner. Be concise but informative.

      QUESTION: ${question}
    `;
    return context;
  }

  public async streamPortfolioAnalysis(question: string, metrics: PortfolioMetrics, recommendations: AssetRecommendation[], apiKey: string) {
    this.initialize(apiKey);
    
    if (!this.ai) {
        throw new Error("Gemini AI client not initialized. Please provide a valid API Key in the sidebar.");
    }

    const prompt = this.buildPrompt(question, metrics, recommendations);

    const response = await this.ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.5,
          topP: 0.9,
          topK: 32,
        }
    });
    
    return response;
  }
}

export const geminiService = new GeminiService();