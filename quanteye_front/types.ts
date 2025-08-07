
export interface PortfolioMetrics {
  portfolio_cagr: number;
  btc_cagr: number;
  portfolio_sharpe: number;
  btc_sharpe: number;
  portfolio_mdd: number;
  btc_mdd: number;
  win_rate: number;
  outperform_rate: number;
}

export interface AssetRecommendation {
  date: string;
  asset: string;
  weight: number;
  exp_ret: number;
  exp_vol: number;
  sharpe: number;
}

export interface TimeSeriesData {
  date: string;
  portfolio: number;
  btc: number;
}

export interface DrawdownData {
    date: string;
    drawdown: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
